const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const KaraokeSchema = new Schema({
    current: {
        type: "object",
          properties: {
            link: {
              type: "string"
            },
            title: {
              type: "string"
            },
            img: {
              type: "string"
            }
          }
    },
    queue: {
        type: "array",
        items: {
          type: "object",
          properties: {
            link: {
              type: "string"
            },
            title: {
              type: "string"
            },
            img: {
              type: "string"
            }
          }
        }
    },
    roomid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Karaoke = mongoose.model("karaokes", KaraokeSchema);
