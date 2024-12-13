import express from 'express';
import { auth } from '../middleware/auth';
import pool from '../config/db';
import { z } from 'zod';

const router = express.Router();

const calculationSchema = z.object({
  type: z.enum(['net-worth', 'budget', 'loan', 'retirement', 'investment', 'debt']),
  data: z.record(z.any()),
});

// Save calculation
router.post('/', auth, async (req, res) => {
  try {
    const { type, data } = calculationSchema.parse(req.body);
    const userId = req.user?.id;

    const result = await pool.query(
      'INSERT INTO calculations (user_id, type, data) VALUES ($1, $2, $3) RETURNING id',
      [userId, type, data]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's calculations
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const type = req.query.type as string;

    let query = 'SELECT * FROM calculations WHERE user_id = $1';
    const params = [userId];

    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific calculation
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const calculationId = req.params.id;

    const result = await pool.query(
      'SELECT * FROM calculations WHERE id = $1 AND user_id = $2',
      [calculationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete calculation
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const calculationId = req.params.id;

    const result = await pool.query(
      'DELETE FROM calculations WHERE id = $1 AND user_id = $2 RETURNING id',
      [calculationId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Calculation not found' });
    }

    res.json({ message: 'Calculation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as calculatorRouter };