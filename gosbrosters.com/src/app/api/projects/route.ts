import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getProjects } from '@/lib/data';

// GET — return the full project list
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to read projects' }, { status: 500 });
  }
}

// POST — add a new project
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

// PUT — update an existing project by id
export async function PUT(request: Request) {
  try {
    const updatedProject = await request.json();
    
    if (!updatedProject.id) {
      return NextResponse.json({ error: 'Project id is required' }, { status: 400 });
    }
    
    const projects = await getProjects();
    const index = projects.findIndex((p: any) => p.id === updatedProject.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Replace the project at the same position
    projects[index] = updatedProject;
    
    await put('data/projects.json', JSON.stringify(projects, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE — remove a project by id
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Project id is required' }, { status: 400 });
    }
    
    const projects = await getProjects();
    const filtered = projects.filter((p: any) => p.id !== id);
    
    if (filtered.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    await put('data/projects.json', JSON.stringify(filtered, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
