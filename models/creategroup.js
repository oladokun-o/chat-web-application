const mongoose = require("mongoose")

const chatRoomSchema = new mongoose.Schema(
  {
      
    group_name: {
        type: String,
        require: true
    },
    users: {
        type: Array,
        require: true
    },
    chatInitiator: {
        type: String,
        require: true
    },
    messages: [{
        user: String,
        message: String,
        time: String
    }]
  },
  {
    timestamps: true,
    collection: "groups",
  }
);

module.exports = mongoose.model('Group', chatRoomSchema);