import { Request, Response } from 'express';
import Note from '../models/Note';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notes = await Note.find({ user: userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { content } = req.body;
    const note = await Note.create({ user: userId, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};
