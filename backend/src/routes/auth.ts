import express from 'express';
import { body, validationResult } from 'express-validator';
import { signup, login, sendOtp, googleAuth, googleCallback } from '../controllers/authController';

const router = express.Router();

router.post('/signup',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  signup
);

router.post('/login',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  login
);

router.post('/send-otp',
  body('email').isEmail(),
  sendOtp
);

router.get('/google', googleAuth);
router.get('/google/callback', ...googleCallback);

export default router;
