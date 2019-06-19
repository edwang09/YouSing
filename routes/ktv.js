const express = require("express");
const router = express.Router();
const soxPath = require("../config/keys").soxPath;
const sox = require('sox-stream');
var ytdl = require("ytdl-core");
var ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("../config/keys").ffmpegPath;
ffmpeg.setFfmpegPath(ffmpegPath)

router.get("/:link", (req, res) => {
    const videoUrl = "http://www.youtube.com/watch?v=" + req.params.link
    ytdl.getInfo(videoUrl, function(err, info){
        if (err) {
            console.log(err.message, resultObj);
        } else {
            const transform = sox({
                soxPath : soxPath,
                global: {
                    buffer: 4096
                },
                input: { type: 'mp3' },
                output: { type: 'mp3' },
                effects: 'oops'
            })
            //Stream setup
            var stream = ytdl.downloadFromInfo(info, {
                quality: "highest",
                // requestOptions: self.requestOptions
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
                    console.log(err.message, null);
                })
                .on("end", function() {
                    // resultObj.file =  fileName;
                    // resultObj.youtubeUrl = videoUrl;
                    // resultObj.videoTitle = videoTitle;
                    // resultObj.artist = artist;
                    // resultObj.title = title;
                    // resultObj.thumbnail = thumbnail;
                    // fs.createReadStream(fileName)
                    // .pipe(transform).on("error",e=>{
                    // })
                    // .on("finish",err=>{
                    //     fs.unlink(fileName,err=>{
                    //         callback(null, resultObj)
                    //     })})
                    // .pipe( fs.createWriteStream(acfileName) )
                })
                .pipe(transform)
                .pipe(res)
            });
        }
    });
});


router.get("/orig/:link", (req, res) => {
    const videoUrl = "http://www.youtube.com/watch?v=" + req.params.link
    ytdl.getInfo(videoUrl, function(err, info){
        if (err) {
            console.log(err.message, resultObj);
        } else {
            //Stream setup
            var stream = ytdl.downloadFromInfo(info, {
                quality: "highest",
                // requestOptions: self.requestOptions
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
                    console.log(err.message, null);
                })
                .on("end", function() {
                })
                .pipe(res)
            });
        }
    });
});
// router.post("/order", (req, res) => {
//     const roomid = req.body.roomid;
//     const order = req.body.order;
//     const link = order.link;
//     const path = "karaoke/" + link + ".mp3"
//     if (!fs.existsSync(path)){
//         Karaoke.findOne({roomid:roomid}).then(karaoke => {
//             karaoke.downloadqueue.push( order )
//             karaoke.save()
//             .then(karaoke => {
//                 sendSocket("push",karaoke,roomid)
//                 const YD = new YoutubeMp3Downloader({
//                     "ffmpegPath": ffmpegPath,        // Where is the FFmpeg binary located?
//                     "outputPath": "./karaoke",    // Where should the downloaded and encoded files be stored?
//                     "youtubeVideoQuality": "highest",       // What video quality should be used?
//                     "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
//                     "progressTimeout": 2000                 // How long should be the interval of the progress reports
//                 });
//                 YD.on("error", function(err, data) {
//                     console.log(err)
//                 });
//                 YD.on("finished", function(err, data) {
//                     console.log(order)
//                     Karaoke.findOne({roomid:roomid}).then(karaoke => {
//                         const newdownloadqueue = karaoke.downloadqueue.filter( list => list.link !== order.link  )
//                         karaoke.downloadqueue=newdownloadqueue
//                         if (karaoke.current.link === "placeholder"){
//                             karaoke.current = order
//                             karaoke.save()
//                             .then(karaoke => {
//                                 sendSocket("push",karaoke,roomid)
//                                 res.json(karaoke)
//                             })
//                             .catch(err=>{
//                                 console.log(err)
//                             })
//                         }else if(data.videoId === link){
//                             karaoke.queue.push( order )
//                             karaoke.save()
//                             .then(karaoke => {
//                                 sendSocket("push",karaoke,roomid)
//                                 res.json(karaoke)
//                             })
//                             .catch(err=>{
//                                 console.log(err)
//                             })
//                         }
                        
//                     });
//                 });
//                 YD.download(link,link+".mp3");
//             })
//             .catch(err=>{
//                 console.log(err)
//             })
//         });
//     }else{
//         Karaoke.findOne({roomid:roomid}).then(karaoke => {
//             if (karaoke.current.link === "placeholder"){
//                 karaoke.current=order
//             }else{
//                 karaoke.queue.push(order)
//             }
//             karaoke.save()
//             .then(karaoke => {
//                 sendSocket("push",karaoke,roomid)
//                 res.json(karaoke)})
//             .catch(err=>{
//                 console.log(err)
//             })
//         });
//     }
// });


module.exports = router;
