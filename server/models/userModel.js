import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },

  verifyOtp: { type: String, default: '' },
  verifyExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },

  cni: { type: String, default: '' },
  passportNumber: { type: String, default: '' },
  state: { type: String, default: '' },
  postCode: { type: String, default: '' },

  role: {
    type: String,
    enum: ['user', 'admin', 'BO'],
    default: 'user'
  },

  lastLogin: { type: Date, default: null }
}, { timestamps: true });

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
