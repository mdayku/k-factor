import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const agentType = searchParams.get('agentType'); // orchestrator, personalization, etc.
    const simulationId = searchParams.get('simulationId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      type: { startsWith: 'agent.' } // All agent events start with 'agent.'
    };
    
    if (userId) where.userId = userId;
    if (simulationId) where.simulationId = simulationId;
    if (agentType) {
      where.type = `agent.${agentType}`;
    }

    // Query agent decision events
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true
            }
          }
        }
      }),
      prisma.event.count({ where })
    ]);

    // Parse agent decisions from metadata
    const decisions = events.map(event => {
      const metadata = event.metadata as any;
      return {
        id: event.id,
        timestamp: event.createdAt,
        agentType: event.type.replace('agent.', ''),
        userId: event.userId,
        user: event.user,
        decision: {
          action: metadata?.action,
          rationale: metadata?.rationale,
          confidence: metadata?.confidence,
          context: metadata?.context,
          result: metadata?.result
        },
        metadata
      };
    });

    // Get agent statistics
    const agentStats = await prisma.event.groupBy({
      by: ['type'],
      where: {
        type: { startsWith: 'agent.' },
        ...(simulationId && { simulationId })
      },
      _count: true
    });

    const stats = agentStats.map(stat => ({
      agentType: stat.type.replace('agent.', ''),
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

