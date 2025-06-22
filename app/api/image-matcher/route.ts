import { NextRequest, NextResponse } from 'next/server';

const DIFY_BASE_URL = 'https://api.dify.ai/v1';
const DIFY_IMAGE_MATCHER_API_KEY = process.env.DIFY_API_KEY_MATCHER;

// Input validation helpers
const validateString = (
  value: string | null,
  maxLength: number = 1000,
): string => {
  if (!value) return '';
  // Remove potential XSS characters and limit length
  return value
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, '');
};

const validateNumber = (
  value: string | null,
  min: number = 0,
  max: number = 1000,
): string => {
  if (!value) return '';
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) return '';
  return num.toString();
};

const validatePlaceId = (value: string | null): string => {
  if (!value) return '';
  // Google Place ID validation pattern
  const placeIdPattern = /^ChIJ[A-Za-z0-9_-]{16,}$/;
  return placeIdPattern.test(value) ? value : '';
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Validate and sanitize inputs
    const name = validateString(searchParams.get('name'), 200);
    const desc = validateString(searchParams.get('desc'), 500);
    const gen_desc = validateString(searchParams.get('gen_desc'), 300);
    const category = validateString(searchParams.get('category'), 100);
    const count = validateNumber(searchParams.get('count'), 0, 100);
    const place_id = validatePlaceId(searchParams.get('place_id'));

    // Required field validation
    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          error:
            'Missing or invalid required field: name (minimum 2 characters)',
        },
        { status: 400 },
      );
    }

    if (!DIFY_IMAGE_MATCHER_API_KEY) {
      return NextResponse.json(
        { error: 'Missing Dify image matcher configuration' },
        { status: 500 },
      );
    }

    // Rate limiting check (optional - you might want to implement this)
    const clientIP =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    // 为缩略图请求添加专门的日志
    if (count === '1') {
      console.log(
        `[Thumbnail Request] from IP: ${clientIP}, Dish Name: "${name}"`,
      );
    } else {
      console.log(`Image matcher request from IP: ${clientIP}`);
    }

    // Execute workflow with validated dish information
    const workflowPayload = {
      inputs: {
        name,
        desc,
        gen_desc,
        category,
        count,
        place_id,
      },
      response_mode: 'blocking',
      user: 'snapfood-image-matcher',
    };

    console.log(
      'Executing image matcher workflow with payload:',
      workflowPayload,
    );
    const workflowRes = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_IMAGE_MATCHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowPayload),
    });

    console.log('Workflow response status:', workflowRes.status);
    const workflowResponseText = await workflowRes.text();
    console.log('Workflow response text:', workflowResponseText);

    let workflowData;
    try {
      workflowData = JSON.parse(workflowResponseText);
    } catch (parseError) {
      console.error('Error parsing workflow response:', parseError);
      console.error('Raw response text:', workflowResponseText);
      // Return an error response if JSON parsing fails
      return NextResponse.json(
        {
          error: 'Invalid JSON response from workflow',
          response: workflowResponseText.substring(0, 200),
        },
        { status: 500 },
      );
    }

    // Extract imageUrls from the workflow response
    const imageUrls = workflowData?.data?.outputs?.imageUrls || [];

    return NextResponse.json(
      {
        imageUrls,
        status: workflowRes.status,
        dishInfo: {
          name,
          desc,
          gen_desc,
          category,
          count,
          place_id,
        },
      },
      { status: workflowRes.ok ? 200 : workflowRes.status },
    );
  } catch (error) {
    console.error('Image Matcher API Error:', error);
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
