import { connectDB } from '@/lib/mongodb';
import Note from '@/models/notes';

export async function GET() {
  await connectDB();
   
  try {
    
    const notes = await Note.find(); // fetch all notes
    return new Response(JSON.stringify({ success: true, notes }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch' }), {
      status: 500,
    });
  }
}