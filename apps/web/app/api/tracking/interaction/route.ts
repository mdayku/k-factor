/**
 * Interaction Tracking API
 * Logs user interactions for AI agent retraining
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow tracking for both authenticated and anonymous users
    const userId = session?.user?.id || 'anonymous';

    const body = await request.json();
    const { type, element, label, value, metadata, timestamp, url, viewport, userAgent } = body;

    // Log interaction event to database
    await prisma.event.create({
      data: {
        type: `interaction.${type}`,
        userId: session?.user?.id || null, // null for anonymous
        surface: 'web',
        metadata: {
          interactionType: type,
          element,
          label,
          value,
          url,
          viewport,
          userAgent,
          timestamp,
          ...metadata,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    // Return success anyway to avoid disrupting user experience
    return NextResponse.json({ success: true });
  }
}

