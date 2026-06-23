import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'pricing.json');

export async function GET() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const pricing = JSON.parse(fileContents);
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error reading pricing:', error);
    return NextResponse.json({ error: 'Failed to read pricing' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPricing = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedPricing, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving pricing:', error);
    return NextResponse.json({ error: 'Failed to save pricing' }, { status: 500 });
  }
}
