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
            },
            type: {
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
            },
            type: {
              type: "string"
            }
          }
        }
    },
    downloadqueue: {
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
            },
            type: {
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
