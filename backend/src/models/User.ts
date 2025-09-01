import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
});

export default mongoose.model<IUser>('User', userSchema);
