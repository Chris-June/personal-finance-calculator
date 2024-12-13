import express from 'express';
import { z } from 'zod';
import { auth } from '../middleware/auth';
import { getFinancialAdvice, streamFinancialAdvice } from '../services/ai';

const router = express.Router();

const adviceRequestSchema = z.object({
  calculatorType: z.string(),
  results: z.record(z.any()),
  userMessage: z.string(),
  chatHistory: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string(),
  })).optional(),
});

// Regular response endpoint
router.post('/advice', auth, async (req, res) => {
  try {
    const data = adviceRequestSchema.parse(req.body);
    const advice = await getFinancialAdvice(data);
    res.json({ advice });
  } catch (error) {
    console.error('Error in /api/ai/advice:', error);
    res.status(500).json({ 
      error: 'Failed to generate financial advice. Please try again later.' 
    });
  }
});

// Streaming response endpoint
router.post('/advice/stream', auth, async (req, res) => {
  try {
    const data = adviceRequestSchema.parse(req.body);

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the response
    for await (const chunk of streamFinancialAdvice(data)) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // End the stream
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error in /api/ai/advice/stream:', error);
    res.write(`data: ${JSON.stringify({ 
      error: 'Failed to stream financial advice. Please try again later.' 
    })}\n\n`);
    res.end();
  }
});

export default router;
