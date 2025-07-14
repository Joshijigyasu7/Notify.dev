import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
