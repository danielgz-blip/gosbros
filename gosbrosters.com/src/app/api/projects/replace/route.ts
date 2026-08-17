import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

// POST — replace the entire projects list in one write
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const projects = body.projects;

    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'projects array is required' }, { status: 400 });
    }

    await put('data/projects.json', JSON.stringify(projects, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json'
    });

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, count: projects.length }, { status: 200 });
  } catch (error) {
    console.error('Error replacing projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to replace projects' }, { status: 500 });
  }
}
