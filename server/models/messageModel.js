import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
   type: {
    type: String,
    enum: ['client', 'admin', 'bo'], // optionnel, utile pour analytics
    default: 'client'
  }
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
