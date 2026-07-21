import { Request, Response } from 'express';
import { pool } from '../config/db';
import { sendSuccess, sendError } from '../utils/response';
import { DashboardStats, ITask, TaskFilters } from '../types/task';

// GET /api/tasks/stats - Dashboard summary counts
export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await pool.query<DashboardStats>(
      `SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
        COUNT(*) FILTER (WHERE status = 'In Progress')::int AS "inProgress",
        COUNT(*) FILTER (WHERE status = 'Completed')::int AS completed,
        COUNT(*) FILTER (
          WHERE status != 'Completed' AND due_date < CURRENT_DATE
        )::int AS overdue
      FROM tasks
      WHERE user_id = $1`,
      [userId]
    );

    return sendSuccess(res, 200, 'Dashboard stats retrieved', result.rows[0]);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return sendError(res, 500, 'Failed to retrieve dashboard statistics');
  }
};

// GET /api/tasks - List all tasks with search, filter, sort
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { search, status, priority, sortBy } = req.query as TaskFilters;

    const conditions: string[] = ['user_id = $1'];
    const params: any[] = [userId];
    let paramIndex = 2;

    if (search) {
      conditions.push(`title ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (priority) {
      conditions.push(`priority = $${paramIndex}`);
      params.push(priority);
      paramIndex++;
    }

    const orderClause =
      sortBy === 'oldest'
        ? 'created_at ASC'
        : sortBy === 'due_date'
        ? 'due_date ASC'
        : 'created_at DESC'; // default: newest

    const query = `
      SELECT id, title, description, priority, status, due_date, created_at, updated_at
      FROM tasks
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderClause}
    `;

    const result = await pool.query<ITask>(query, params);
    return sendSuccess(res, 200, 'Tasks retrieved', result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return sendError(res, 500, 'Failed to retrieve tasks');
  }
};

// GET /api/tasks/:id - Get single task
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await pool.query<ITask>(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    return sendSuccess(res, 200, 'Task retrieved', result.rows[0]);
  } catch (error) {
    console.error('Error fetching task:', error);
    return sendError(res, 500, 'Failed to retrieve task');
  }
};

// POST /api/tasks - Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title, description, priority, status, due_date } = req.body;

    const result = await pool.query<ITask>(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, title, description || null, priority, status, due_date]
    );

    return sendSuccess(res, 201, 'Task created successfully', result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    return sendError(res, 500, 'Failed to create task');
  }
};

// PUT /api/tasks/:id - Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    const { title, description, priority, status, due_date } = req.body;

    // Check task belongs to user
    const existing = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existing.rows.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    const result = await pool.query<ITask>(
      `UPDATE tasks
       SET title = $1, description = $2, priority = $3, status = $4, due_date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [title, description || null, priority, status, due_date, id, userId]
    );

    return sendSuccess(res, 200, 'Task updated successfully', result.rows[0]);
  } catch (error) {
    console.error('Error updating task:', error);
    return sendError(res, 500, 'Failed to update task');
  }
};

// DELETE /api/tasks/:id - Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 404, 'Task not found');
    }

    return sendSuccess(res, 200, 'Task deleted successfully');
  } catch (error) {
    console.error('Error deleting task:', error);
    return sendError(res, 500, 'Failed to delete task');
  }
};
