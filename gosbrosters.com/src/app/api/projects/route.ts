import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const newProject = await request.json();
    
    // Path to the centralized projects.json
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    
    // Read the existing projects
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    
    // Add the new project to the beginning of the array (or end, based on preference)
    projects.unshift(newProject);
    
    // Write back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
    
    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ success: false, error: 'Failed to save project' }, { status: 500 });
  }
}
