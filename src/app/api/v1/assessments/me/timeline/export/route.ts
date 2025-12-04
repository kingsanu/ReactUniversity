import { NextRequest, NextResponse } from 'next/server';
import { getTimelineEvents, prepareCSVExport } from '@/services/timelineService';
import { getUserIdFromRequest } from '@/lib/auth';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import TimelinePDF from '@/components/pdf/TimelinePDF';
import { TimelineExportConfig } from '@/types/timeline';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from JWT token
    const userId = getUserIdFromRequest(request);

    // Parse request body
    const body: TimelineExportConfig = await request.json();
    const {
      format,
      dateRange,
      filterTypes,
      filterStatus,
      includeDetails = true,
      language = 'en',
    } = body;

    if (!format || !['pdf', 'csv'].includes(format)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_FORMAT',
            message: 'Format must be pdf or csv',
          },
        },
        { status: 400 }
      );
    }

    // Build filters
    const filters = {
      dateRange,
      types: filterTypes,
      status: filterStatus,
    };

    // Get timeline events
    const { events } = await getTimelineEvents(userId, filters, language as 'en' | 'sp');

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `assessment_timeline_${timestamp}.${format}`;

    if (format === 'csv') {
      const csvContent = prepareCSVExport(events, language as 'en' | 'sp');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } else if (format === 'pdf') {
      const pdfBuffer = await renderToBuffer(
        React.createElement(TimelinePDF, { events, language })
      );

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

  } catch (error) {
    console.error('Timeline export API error:', error);

    if (error instanceof Error) {
      if (error.message === 'No authorization token provided' || error.message === 'Invalid token') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to export timeline data',
        },
      },
      { status: 500 }
    );
  }
}