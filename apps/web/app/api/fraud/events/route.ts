/**
 * Fraud & Compliance Events API
 * Returns flagged events for monitoring dashboard
 */

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const severityFilter = searchParams.get('severity'); // low, medium, high
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fraud events are stored as regular events with type "fraud.*" or "compliance.*"
    const where: any = {
      OR: [
        { type: { startsWith: 'fraud.' } },
        { type: { startsWith: 'compliance.' } },
        { type: { startsWith: 'trust_safety.' } },
      ]
    };
    
    if (userId) where.userId = userId;
    if (severityFilter) {
      where.metadata = {
        path: ['severity'],
        equals: severityFilter
      };
    }

    // Query fraud/compliance events
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

    // Parse event details
    const fraudEvents = events.map(event => ({
      id: event.id,
      type: event.type,
      userId: event.userId,
      userEmail: event.user?.email,
      createdAt: event.createdAt,
      severity: (event.metadata as any)?.severity || 'medium',
      description: (event.metadata as any)?.description || event.type,
      metadata: event.metadata,
      resolved: (event.metadata as any)?.resolved || false,
    }));

    // Summary stats
    const stats = {
      total,
      bySeverity: {
        high: fraudEvents.filter(e => e.severity === 'high').length,
        medium: fraudEvents.filter(e => e.severity === 'medium').length,
        low: fraudEvents.filter(e => e.severity === 'low').length,
      },
      unresolved: fraudEvents.filter(e => !e.resolved).length,
    };

    return NextResponse.json({
      events: fraudEvents,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      stats
    });
  } catch (error) {
    console.error('Error fetching fraud events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fraud events' },
      { status: 500 }
    );
  }
}

/**
 * POST: Log a new fraud/compliance event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, severity, description, metadata } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'userId and type are required' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        type: type.startsWith('fraud.') || type.startsWith('compliance.') ? type : `fraud.${type}`,
        userId,
        surface: 'fraud_detection',
        metadata: {
          severity: severity || 'medium',
          description: description || 'Suspicious activity detected',
          resolved: false,
          timestamp: new Date().toISOString(),
          ...metadata,
        },
      },
    });

    return NextResponse.json({
      success: true,
      eventId: event.id,
    });
  } catch (error) {
    console.error('Error logging fraud event:', error);
    return NextResponse.json(
      { error: 'Failed to log fraud event' },
      { status: 500 }
    );
  }
}

