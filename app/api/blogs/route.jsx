import { connectDB } from '@/lib/mongodb';
import Note from '@/models/notes';

export async function POST(req) {
  await connectDB();
  const { text } = await req.json();
  const note = await Note.create({ text });
  return Response.json({ id: note._id, text: note.text });
}
 