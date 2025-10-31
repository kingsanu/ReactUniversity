import { NextRequest, NextResponse } from 'next/server';
import { generateProfessionalSummary } from '@/lib/ai/llmClient';
import {
  validateRequiredFields,
  validateEnum,
  validateStringArray,
  validateRange,
  sanitizeInput,
  successResponse,
  errorResponse,
  checkRateLimit,
  logGenerationEvent,
} from '@/lib/ai/apiUtils';

export const runtime = 'nodejs';
export const maxDuration = 60; // 1 minute timeout for generation

/**
 * POST /api/resume/generate/professional-summary
 * 
 * Generates an ATS-optimized professional summary based on career profile
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from JWT (would normally extract from auth header)
    const userId = 'user-placeholder'; // TODO: Extract from JWT

    // Check rate limiting
    const rateLimit = await checkRateLimit(userId, 'generate-summary', 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        errorResponse(
          'RATE_LIMIT_EXCEEDED',
          'Too many requests. Please try again later.',
          { resetTime: rateLimit.resetTime }
        ),
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'careerLevel',
      'industry',
      'yearsOfExperience',
      'keySkills',
    ]);

    if (!validation.valid) {
      return NextResponse.json(
        errorResponse(
          'MISSING_REQUIRED_FIELDS',
          `Missing required fields: ${validation.missingFields.join(', ')}`
        ),
        { status: 400 }
      );
    }

    // Validate career level
    const careerLevelValidation = validateEnum(
      body.careerLevel,
      ['entry-level', 'mid-career', 'senior', 'executive'],
      'careerLevel'
    );
    if (!careerLevelValidation.valid) {
      return NextResponse.json(
        errorResponse('INVALID_CAREER_LEVEL', careerLevelValidation.error!),
        { status: 400 }
      );
    }

    // Validate years of experience
    const yearsValidation = validateRange(
      body.yearsOfExperience,
      0,
      70,
      'yearsOfExperience'
    );
    if (!yearsValidation.valid) {
      return NextResponse.json(
        errorResponse('INVALID_YEARS', yearsValidation.error!),
        { status: 400 }
      );
    }

    // Validate skills array
    const skillsValidation = validateStringArray(body.keySkills, 'keySkills', 1, 50);
    if (!skillsValidation.valid) {
      return NextResponse.json(
        errorResponse('INVALID_SKILLS', skillsValidation.error!),
        { status: 400 }
      );
    }

    // Validate optional fields
    const industry = sanitizeInput(body.industry, 100);
    const targetRole = body.targetRole ? sanitizeInput(body.targetRole, 100) : undefined;
    const tone = body.tone || 'professional';
    const maxWords = body.maxWords || 80;

    // Validate tone
    const toneValidation = validateEnum(
      tone,
      ['professional', 'achievement-focused', 'impact-driven', 'leadership-focused'],
      'tone'
    );
    if (!toneValidation.valid) {
      return NextResponse.json(
        errorResponse('INVALID_TONE', toneValidation.error!),
        { status: 400 }
      );
    }

    // Validate maxWords
    const maxWordsValidation = validateRange(maxWords, 20, 200, 'maxWords');
    if (!maxWordsValidation.valid) {
      return NextResponse.json(
        errorResponse('INVALID_MAX_WORDS', maxWordsValidation.error!),
        { status: 400 }
      );
    }

    // Log generation start
    await logGenerationEvent(userId, 'generate_summary_start', {
      careerLevel: body.careerLevel,
      industry,
      yearsOfExperience: body.yearsOfExperience,
      skillCount: skillsValidation.data?.length,
    });

    // Validate achievements if provided
    let achievements: string[] | undefined;
    if (body.achievements) {
      const achievementsValidation = validateStringArray(
        body.achievements,
        'achievements',
        0,
        100
      );
      if (achievementsValidation.valid) {
        achievements = achievementsValidation.data;
      }
    }

    // Generate summary
    const generatedSummary = await generateProfessionalSummary(
      body.careerLevel,
      industry,
      body.yearsOfExperience,
      skillsValidation.data!,
      targetRole,
      achievements
    );

    // Calculate word count
    const wordCount = generatedSummary.split(/\s+/).length;

    // Log successful generation
    await logGenerationEvent(userId, 'generate_summary_success', {
      wordCount,
      careerLevel: body.careerLevel,
    });

    // Return success response
    return NextResponse.json(
      successResponse(
        {
          generated_content: generatedSummary,
          wordCount,
          keywordsIncluded: extractKeywords(generatedSummary, 5),
          atsScore: 0.87, // TODO: Calculate actual ATS score
          tone,
        },
        {
          generatedAt: new Date().toISOString(),
          model: 'gpt-4o-mini',
          tokensUsed: estimateTokens(generatedSummary),
        }
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Professional summary generation error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    // Check if it's an API error
    if (errorMessage.includes('API error') || errorMessage.includes('OpenAI')) {
      return NextResponse.json(
        errorResponse(
          'GENERATION_FAILED',
          'Failed to generate content. Please try again later.'
        ),
        { status: 500 }
      );
    }

    // Check if it's a timeout
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return NextResponse.json(
        errorResponse('GENERATION_TIMEOUT', 'Generation took too long. Please try again.'),
        { status: 504 }
      );
    }

    return NextResponse.json(
      errorResponse('INTERNAL_ERROR', 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

/**
 * Extract important keywords from text
 */
function extractKeywords(text: string, limit: number = 5): string[] {
  // Simple keyword extraction (in production, use NLP library)
  const words = text
    .toLowerCase()
    .split(/[\s,;:.!?]+/)
    .filter(word => word.length > 4);

  // Return unique words (in production, score by importance)
  return [...new Set(words)].slice(0, limit);
}

/**
 * Estimate tokens used by OpenAI
 * Rule of thumb: ~4 characters = 1 token
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
