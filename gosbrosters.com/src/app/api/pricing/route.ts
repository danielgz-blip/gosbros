import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';
import { getPricing } from '@/lib/data';

export async function GET() {
  try {
    const pricing = await getPricing();
    return NextResponse.json(pricing);
  } catch (error) {
    console.error('Error reading pricing:', error);
    return NextResponse.json({ error: 'Failed to read pricing' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedPricing = await request.json();
    
    // Write back to Vercel Blob
    await put('data/pricing.json', JSON.stringify(updatedPricing, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json'
    });
    
    // Invalidate cache so UI fetches fresh data
    revalidatePath('/', 'layout');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving pricing:', error);
    return NextResponse.json({ error: 'Failed to save pricing' }, { status: 500 });
  }
}
