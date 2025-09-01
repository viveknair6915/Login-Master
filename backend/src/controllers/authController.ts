
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Google OAuth Passport Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails && profile.emails[0].value,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, undefined);
  }
});

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
  }
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
  res.json({ message: 'OTP sent' });
};

export const signup = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, otp } = req.body;
  if (!otp) return res.status(400).json({ message: 'OTP is required' });
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpires) {
    return res.status(400).json({ message: 'OTP not requested' });
  }
  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  if (user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP expired' });
  }
  user.password = await bcrypt.hash(password, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.status(201).json({ user: { id: user._id, email: user.email }, token });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    return res.status(400).json({ message: 'User not found or password not set' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  res.json({ user: { id: user._id, email: user.email }, token });
};

// Google OAuth stubs (to be implemented)

// Google OAuth endpoints (to be used in routes)
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = [
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: any, res: Response) => {
    // Issue JWT and redirect to frontend with token
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    // Redirect to frontend with token as query param
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/welcome?token=${token}`);
  }
];
