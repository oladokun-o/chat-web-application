const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
      
    username: {
        type: String,
        require: true
    },
    group_created: {
        type: Array,
        require: true
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model('User', userSchema);