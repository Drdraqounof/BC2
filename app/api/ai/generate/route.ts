import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context = '', systemPrompt = '' } = body;
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Build the message with optional context
    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `${context}\n\nBased on the above context, please: ${prompt}`;
    }

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

    if (typeof systemPrompt === 'string' && systemPrompt.trim()) {
      messages.push({
        role: 'system',
        content: systemPrompt.trim(),
      });
    }

    messages.push({
      role: 'user',
      content: fullPrompt,
    });

    const message = await openai.chat.completions.create({
      model,
      max_tokens: 1024,
      messages,
    });

    const generatedText = message.choices[0]?.message?.content || '';

    return NextResponse.json({
      content: generatedText,
      prompt,
    });
  } catch (error: any) {
    console.error('Error generating content:', error);

    // Handle specific OpenAI errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Update OPENAI_API_KEY in .env and restart the dev server.' },
        { status: 401 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.status === 403) {
      const providerMessage = typeof error?.message === 'string' && error.message.trim()
        ? error.message
        : 'The configured OpenAI project does not have access to the requested model.';

      return NextResponse.json(
        { error: providerMessage },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
