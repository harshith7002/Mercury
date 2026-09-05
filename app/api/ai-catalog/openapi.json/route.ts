import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || 'https://mercury-agentic.vercel.app';

  const openApiSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Mercury Policy-Governed Agentic Commerce API',
      description:
        'Standardized API for autonomous AI Buyer Agents to search catalog, execute A2A price negotiations, and initiate Razorpay Test Mode checkout under merchant policy governance.',
      version: '1.0.0',
    },
    servers: [
      {
        url: origin,
        description: 'Mercury Production/Test Server',
      },
    ],
    paths: {
      '/api/ai-catalog': {
        get: {
          summary: 'Retrieve machine-readable JSON-LD product catalog and merchant policy caps',
          responses: {
            '200': {
              description: 'JSON-LD catalog feed with stock and negotiable discount limits',
            },
          },
        },
      },
      '/api/buyer/negotiate': {
        post: {
          summary: 'Initiate Agent-to-Agent dynamic price/bundle negotiation',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'requestedBudget'],
                  properties: {
                    productId: { type: 'string', example: 'prod_1' },
                    requestedBudget: { type: 'number', example: 7500 },
                    buyerNote: { type: 'string', example: 'Looking for a dynamic discount' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Negotiation result: ACCEPTED or PENDING_MERCHANT_APPROVAL',
            },
          },
        },
      },
      '/api/razorpay/order': {
        post: {
          summary: 'Create Razorpay Test Mode order',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount'],
                  properties: {
                    amount: { type: 'number', example: 8500 },
                    items: { type: 'array' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Razorpay order created with order_id',
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
