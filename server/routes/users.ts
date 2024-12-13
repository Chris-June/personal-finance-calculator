import express from 'express';
import { auth } from '../middleware/auth';
import pool from '../config/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email, currentPassword, newPassword } = updateProfileSchema.parse(req.body);

    // Start building the query
    let query = 'UPDATE users SET';
    const values = [];
    let paramCount = 1;

    if (name) {
      query += ` name = $${paramCount},`;
      values.push(name);
      paramCount++;
    }

    if (email) {
      query += ` email = $${paramCount},`;
      values.push(email);
      paramCount++;
    }

    if (currentPassword && newPassword) {
      // Verify current password
      const user = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
      const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      query += ` password = $${paramCount},`;
      values.push(hashedPassword);
      paramCount++;
    }

    // Remove trailing comma and add WHERE clause
    query = query.slice(0, -1) + ` WHERE id = $${paramCount} RETURNING id, email, name`;
    values.push(userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user account
router.delete('/profile', auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    // Delete all user's calculations first
    await pool.query('DELETE FROM calculations WHERE user_id = $1', [userId]);

    // Delete user
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.clearCookie('token');
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export { router as userRouter };