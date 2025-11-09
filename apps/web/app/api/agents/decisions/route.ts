import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const agentType = searchParams.get('agentType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause for AgentDecision table
    const where: any = {};
    
    if (userId) where.userId = userId;
    if (agentType) where.agent = agentType;

    // Query AgentDecision table (not Event table)
    const [agentDecisions, total] = await Promise.all([
      prisma.agentDecision.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.agentDecision.count({ where })
    ]);

    // Format decisions for dashboard
    const decisions = agentDecisions.map(ad => ({
      id: ad.id,
      timestamp: ad.createdAt,
      agentType: ad.agent,
      userId: ad.userId || 'system',
      decision: {
        action: (ad.decision as any)?.loop || (ad.decision as any)?.cohort || (ad.decision as any)?.showPresence || 'decision',
        rationale: ad.rationale,
        confidence: null, // Not stored in current schema
        context: ad.decision,
        result: null
      }
    }));

    // Get agent statistics
    const agentStats = await prisma.agentDecision.groupBy({
      by: ['agent'],
      _count: true
    });

    const stats = agentStats.map(stat => ({
      agentType: stat.agent,
      totalDecisions: stat._count
    }));

    return NextResponse.json({
      decisions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching agent decisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent decisions' },
      { status: 500 }
    );
  }
}

