const express = require("express");
const router = express.Router();
const Karaoke = require("../models/Karaoke");
const fs = require('fs');
const soxPath = require("../config/keys").soxPath;
const sox = require('sox-stream');
var ytdl = require("./node_modules/ytdl-core");
var ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("../config/keys").ffmpegPath;
ffmpeg.setFfmpegPath(ffmpegPath)

const YoutubeMp3Downloader = require("../youtube-downloader");


const placeholder = {
    link: "placeholder",
    title: "placeholder",
    img: "https://designshack.net/wp-content/uploads/placehold.jpg"
}

function sendSocket(type,data,roomid){
    const socketData = {
        type:type,
        roomid: roomid,
        data: data
    }
    console.log(socketData)
    if(WSCLIENTS[roomid] && WSCLIENTS[roomid].host && WSCLIENTS[roomid].host.ws.readyState===1){
        WSCLIENTS[roomid].host.ws.send(JSON.stringify(socketData),function ack(error) {
            if (error){
              console.log(error)
            }
          })
    }
    if(WSCLIENTS[roomid] && WSCLIENTS[roomid].client){
        WSCLIENTS[roomid].client.forEach(ws=>{
            if (ws.ws.readyState===1) {
                ws.ws.send(JSON.stringify(socketData),function ack(error) {
                if (error){
                    console.log(error)
                }
                })
            }
        })
    }
}



//@route   GET api/karaoke/all
//@desc    Test karaoke route
//@access  Public
router.get("/all", (req, res) => {
    Karaoke.find({}).then(karaokes => {
        if (!karaokes) {
            errors.votes = "No karaoke exists";
            return res.status(400).json(errors);
        } else {
            res.json(karaokes);
        }
    });
});

//@route   POST api/karaoke/create
//@desc    create karaoke host
//@access  Public
router.post("/create", (req, res) => {
    const roomid = req.body.roomid;
    Karaoke.find({roomid:roomid}).then(karaokes => {
        console.log(karaokes)
        if (karaokes.length === 0) {
            const newKaraoke = new Karaoke({
                current: placeholder,
                queue: [],
                roomid: req.body.roomid
              });
              newKaraoke.save().then(karaoke => {
                res.json(karaoke);
              });
        } else {
            res.json(karaokes);
        }
    });
    
});

//@route   POST api/karaoke/pushlyric
//@desc    pushlyric karaoke host
//@access  Public
router.post("/pushlyric", (req, res) => {
    const roomid = req.body.roomid;
    const lyric = req.body.lyric;
    sendSocket("lyric", lyric,roomid)
    res.send({success:true})
});


//@route   POST api/karaoke/order
//@desc    order karaoke host
//@access  Public
router.post("/order", (req, res) => {
    const roomid = req.body.roomid;
    const order = req.body.order;
    const link = order.link;
    const path = "karaoke/" + link + ".mp3"
    const transform = sox({
        soxPath : soxPath,
        global: {
            buffer: 4096
        },
        input: { type: 'mp3' },
        output: { type: 'mp3' },
        effects: 'oops'
    })
    if (!fs.existsSync(path)){
        Karaoke.findOne({roomid:roomid}).then(karaoke => {
            karaoke.downloadqueue.push( order )
            karaoke.save()
            .then(karaoke => {
                sendSocket("push",karaoke,roomid)
                const videoUrl = "http://www.youtube.com/watch?v=" + link
                ytdl.getInfo(videoUrl, function(err, info){
                    if (err) {
                        console.log(err.message, resultObj);
                    } else {
                        //Stream setup
                        var stream = ytdl.downloadFromInfo(info, {
                            quality: "highest",
                            requestOptions: { maxRedirects: 5 }
                        });
                        stream.on("response", function(httpResponse) {
                            //Start encoding
                            var proc = new ffmpeg({
                                source: stream
                            })
                            .audioBitrate(info.formats[0].audioBitrate)
                            .withAudioCodec("libmp3lame")
                            .toFormat("mp3")
                            .outputOptions("-id3v2_version", "4")
                            .outputOptions("-metadata", "title=" + "title")
                            .outputOptions("-metadata", "artist=" + "artist")
                            .on("error", function(err) {
                                Karaoke.findOne({roomid:roomid}).then(karaoke => {
                                    const newdownloadqueue = karaoke.downloadqueue.filter( list => list.link !== order.link  )
                                    karaoke.downloadqueue=newdownloadqueue
                                    karaoke.save()
                                    sendSocket("push",karaoke,roomid)
                                    res.json(karaoke)
                                });
                            })
                            .on("end", function() {
                                Karaoke.findOne({roomid:roomid}).then(karaoke => {
                                    const newdownloadqueue = karaoke.downloadqueue.filter( list => list.link !== order.link  )
                                    karaoke.downloadqueue=newdownloadqueue
                                    if (karaoke.current.link === "placeholder"){
                                        karaoke.current = order
                                        karaoke.save()
                                        .then(karaoke => {
                                            sendSocket("push",karaoke,roomid)
                                            res.json(karaoke)
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                    }else{
                                        karaoke.queue.push( order )
                                        karaoke.save()
                                        .then(karaoke => {
                                            sendSocket("push",karaoke,roomid)
                                            res.json(karaoke)
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                    }
                                });
                            })
                            .pipe(transform)
                            .pipe(fs.createWriteStream("./karaoke/" + link +".mp3"))
                        });
                    }
                });
            })
            .catch(err=>{
                console.log(err)
            })
        });
    }else{
        Karaoke.findOne({roomid:roomid}).then(karaoke => {
            if (karaoke.current.link === "placeholder"){
                karaoke.current=order
            }else{
                karaoke.queue.push(order)
            }
            karaoke.save()
            .then(karaoke => {
                sendSocket("push",karaoke,roomid)
                res.json(karaoke)})
            .catch(err=>{
                console.log(err)
            })
        });
    }
});

//@route   GET api/karaoke/order
//@desc    order karaoke host
//@access  Public
router.get("/audio/:url", (req, res) => {
    const url = req.params.url
    const path = "karaoke/" + url + ".mp3"
    if (fs.existsSync(path)){
        fs.createReadStream(path)
        .on("error",e=>{
            res.end({failed:true})
        })
        .pipe(res);
    }else{
        res.send({failed:true})
        console.log("failed")
    }
});

//@route   POST api/karaokes/room
//@desc    room karaoke hosts
//@access  Public
router.post("/room", (req, res) => {
    const roomid = req.body.roomid;
    Karaoke.findOne({roomid}).then(karaoke => {
        if (!karaoke) {
            const errors = {err:"No karaoke exists"};
            res.status(400).json(errors);
        } else {
            res.json(karaoke);
        }
    }).catch(err=>{
        console.log(err)
    });
});

//@route   POST api/karaokes/next
//@desc    next karaoke host
//@access  Public
router.post("/next", (req, res) => {
    const roomid = req.body.roomid;
    Karaoke.findOne({roomid:roomid}).then(karaoke => {
        if (karaoke.queue.length > 0){
            karaoke.current = karaoke.queue[0]
            karaoke.queue.shift()
        }else{
            karaoke.current = placeholder
        }
        karaoke.save()
        .then(karaoke => {
            sendSocket("push",karaoke,roomid)
            res.json(karaoke)})
        .catch(err=>{
            res.json({
                success: false,
                err
          });
        })
      });
});

//@route   DELETE api/karaoke
//@desc    delete karaoke host
//@access  Public
router.delete("/", (req, res) => {
  let errors = {};
  const roomid = req.body.roomid;
  Karaoke.findOneAndRemove({roomid:roomid}).then(() => {
    res.json({
      success: true
    });
  });
})


//@route   DELETE api/karaoke/all
//@desc    delete karaoke host
//@access  Public
router.delete("/all",  (req, res) => {
    Karaoke.find().then(async karaokes => {
        console.log(karaokes)
        await Promise.all(karaokes.map(karaoke =>{
            karaoke.remove()
        }))
        res.send("done")
    });
  })
module.exports = router;
