import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parse } from 'csv-parse/sync';

export async function POST(req: NextRequest) {
  // 1. Security: Check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Get the file from the request form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.type !== 'text/csv') {
      return NextResponse.json({ error: 'Invalid file. Please upload a CSV.' }, { status: 400 });
    }

    // 3. Read file content as text
    const text = await file.text();

    // 4. Parse CSV using csv-parse library
    // We skip empty lines and trim whitespace
    const records = parse(text, {
      columns: true, // Use first row as headers
      skip_empty_lines: true,
      trim: true,
    });

    // 5. Run Basic Validation Logic
    const validationResults = validateData(records);

    // 6. Return JSON response
    return NextResponse.json({
      success: true,
      fileName: file.name,
      totalRows: records.length,
      columns: Object.keys(records[0] || {}),
      validation: validationResults,
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}

// --- Helper Function: Basic Validation Logic ---
function validateData(records: any[]) {
  const errors: any[] = [];
  const warnings: any[] = [];
  
  // Example Rules:
  // 1. Check for empty required fields (assuming 'email' or 'id' might exist)
  // 2. Check for duplicate rows
  
  const seenEmails = new Set();

  records.forEach((row: any, index: number) => {
    const rowIndex = index + 2; // +2 because CSV rows start at 1, and header is 1

    // Rule A: Check for completely empty rows
    if (Object.values(row).every(val => val === '')) {
      errors.push({ row: rowIndex, message: 'Empty row detected' });
      return;
    }

    // Rule B: If an 'email' column exists, validate format
    if (row.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        errors.push({ row: rowIndex, column: 'email', message: `Invalid email: ${row.email}` });
      }
      
      // Rule C: Check for duplicate emails
      if (seenEmails.has(row.email)) {
        warnings.push({ row: rowIndex, column: 'email', message: `Duplicate email: ${row.email}` });
      } else {
        seenEmails.add(row.email);
      }
    }
    
    // Rule D: Check for missing values in any column (Warning only)
    Object.entries(row).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        warnings.push({ row: rowIndex, column: key, message: 'Missing value' });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errorCount: errors.length,
    warningCount: warnings.length,
    errors,
    warnings,
  };
}