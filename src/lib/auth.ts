import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export async function authenticateAdmin(email: string, password: string) {
  const { data: user, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}
