import express from 'express';
import { verifyJWT } from '../middleware/auth';
import { createNote, deleteNote, getNotes } from '../controllers/notesController';

const router = express.Router();

router.get('/', verifyJWT, getNotes);
router.post('/', verifyJWT, createNote);
router.delete('/:id', verifyJWT, deleteNote);

export default router;
