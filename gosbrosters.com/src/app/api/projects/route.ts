import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getProjects } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    
    // Fetch current projects
    const projects = await getProjects();
    
    // Add the new project to the beginning of the array
    projects.unshift(newProject);
    
    // Write back to Vercel Blob
    await put('data/projects.json', JSON.stringify(projects, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    
    // Invalidate cache so UI fetches fresh data
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ success: false, error: 'Failed to save project' }, { status: 500 });
  }
}
