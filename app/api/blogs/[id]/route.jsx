import { connectDB } from '@/lib/mongodb';
import Note from '@/models/notes';

export async function DELETE(request, context) {
  const { params } = context; 

  await connectDB();

  try {
    const deleted = await Note.findByIdAndDelete(params.id);

    if (!deleted) {
      return new Response(JSON.stringify({ error: 'Note not found' }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response(JSON.stringify({ error: 'Delete failed' }), {
      status: 500,
    });
  }
}
