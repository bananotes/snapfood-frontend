import { NextRequest, NextResponse } from 'next/server';

const DIFY_BASE_URL = 'https://api.dify.ai/v1';
const DIFY_API_KEY = process.env.DIFY_API_KEY; // Set your Dify API key in env

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const language = formData.get('language') as string;
    const longitude = formData.get('longitude') as string;
    const latitude = formData.get('latitude') as string;

    if (!photo || !language || !longitude || !latitude) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!DIFY_API_KEY) {
      return NextResponse.json(
        { error: 'Missing Dify configuration' },
        { status: 500 },
      );
    }

    // Step 1: Upload file to Dify
    const uploadForm = new FormData();
    uploadForm.append('file', photo);
    uploadForm.append('user', 'snapfood-backend'); // User identifier

    const uploadRes = await fetch(`${DIFY_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: uploadForm,
    });

    if (!uploadRes.ok) {
      const uploadError = await uploadRes.json();
      return NextResponse.json(
        {
          error: `File upload failed: ${uploadError.message || 'Unknown error'}`,
        },
        { status: uploadRes.status },
      );
    }

    const uploadData = await uploadRes.json();
    const fileId = uploadData.id;

    // Step 2: Execute workflow with uploaded file ID
    const workflowPayload = {
      inputs: {
        menu_image: {
          type: 'image',
          upload_file_id: fileId, // Use the uploaded file ID
          transfer_method: 'local_file',
        },
        target_language: language,
        longitude,
        latitude,
      },
      response_mode: 'blocking',
      user: 'snapfood-backend',
    };

    const workflowRes = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowPayload),
    });
    const workflowText = await workflowRes.text();
    const workflowData = JSON.parse(workflowText);
    console.log('Workflow response:', workflowData);

    return NextResponse.json(
      {
        status: workflowRes.status,
        data: workflowData.data,
        uploadedFile: {
          id: fileId,
          name: uploadData.name,
          size: uploadData.size,
        },
      },
      { status: workflowRes.status },
    );
  } catch (error) {
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : String(error);
    return NextResponse.json(
      { error: `Internal Server Error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
