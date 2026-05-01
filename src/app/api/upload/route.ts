import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Check Authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse Form Data
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are allowed' }, { status: 400 })
    }

    // 3. Upload to Supabase Storage
    // Create a unique filename to prevent collisions: userId/timestamp-filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Storage error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // 4. Save Metadata to Database (Prisma)
    const uploadRecord = await prisma.upload.create({
      data: {
        userId: user.id,
        fileName: file.name, // Original name for display
        fileSize: file.size,
        status: 'COMPLETED', // Or 'PROCESSING' if you add background jobs later
        recordCount: null, // We'll calculate this in a future step
      },
    })

    return NextResponse.json({ 
      message: 'Upload successful', 
      uploadRecord 
    }, { status: 201 })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}