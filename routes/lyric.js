const express = require("express");
const https = require("https");
const router = express.Router();
const fs = require('fs');

var cheerio = require('cheerio');




router.post("/search", (req, res) => {
    const keywords = req.body.keywords;
    console.log(keywords)
    https.get(encodeURI(`https://mojim.com/${keywords}.html?g3`), function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        let writeStream = fs.createWriteStream('secret.html');
        response.on('data', (chunk) => { rawData += chunk; writeStream.write(chunk) });
        response.on('end', () => {
          try {
              const records = rawData.replace(/<\/?font[^>]*?>/g,"").match(/<dd class="mxsh_dd[12]">.*\n.*\n.*\n.*\n.*\n.*\n<\/dd>/g)
              const result = []
              console.log(records.length)
              records.map((row)=>{
                const singer = row.match(/<span.+?mxsh_ss2[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)?row.match(/<span.+?mxsh_ss2[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)[0].replace(/<\/?span[^>]*?>/g,"").replace(/<\/?a[^>]*?>/g,"") : null
                const album = row.match(/<span.+?mxsh_ss3[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)?row.match(/<span.+?mxsh_ss3[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)[0].replace(/<\/?span[^>]*?>/g,"").replace(/<\/?a[^>]*?>/g,"") : null
                const song = row.match(/<span.+?mxsh_ss4[^>]*?><a[^>]*?>.*?<\/a><\/span>/g) ? row.match(/<span.+?mxsh_ss4[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)[0].replace(/<\/?span[^>]*?>/g,"").replace(/<\/?a[^>]*?>/g,"") : null
                const link = row.match(/<span.+?mxsh_ss4[^>]*?><a[^>]*?>.*?<\/a><\/span>/g) && row.match(/<span.+?mxsh_ss4[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)[0].match(/href=".*?"/g) ? row.match(/<span.+?mxsh_ss4[^>]*?><a[^>]*?>.*?<\/a><\/span>/g)[0].match(/href=".*?"/g)[0].replace(/href=/g,"").replace(/"/g,"") : null
                const date = row.match(/<span.+?mxsh_ss5[^>]*?>.*?<\/span>/g) ? row.match(/<span.+?mxsh_ss5[^>]*?>.*?<\/span>/g)[0].replace(/<\/?span[^>]*?>/g,"").replace(/<\/?a[^>]*?>/g,"") : null
                const rowObject = {
                    singer,album,song,link,date
                }
                result.push(rowObject)
              })
              res.send(result)

          } catch (e) {
            console.error(e.message);
          }
        });
    }).on('error', function(e) {
    console.log("error");
    console.log(e);
    });
    
});
router.post("/text", (req, res) => {
    const url = req.body.url;

    https.get(encodeURI(`https://mojim.com${url}`), function(response) {
        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
          try {
            var $ = cheerio.load(rawData);
            // preprocessing
            $('head, script, style').remove();
          
            var texts = [];
            $('*').each((i, elem) => {
              var $elem = $(elem).clone();
              $elem.find('br').replaceWith('\n');
              $elem.find('*').remove();
              var t = $elem.text().trim();
              t = t.replace(/\r/g, '');
              t = t.replace(/\n\n/g, '\n');
              if(t.length > 0) texts.push(t); 
            });
            var largest = texts.reduce((acc, val) => {
              if(acc.length > val.length) return acc;
              else return val;
            });
            res.send({
                lyric:largest
            }) 
          
          } catch (e) {
            console.error(e.message);
          }
        });
    }).on('error', function(e) {
    console.log("error");
    console.log(e);
    });
    
});

module.exports = router;
