import { NextRequest, NextResponse } from 'next/server';
import {
  clearAdminSessionCookie,
  isAdminRequest,
  setAdminSessionCookie,
} from '@/lib/admin/auth';

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured' }, { status: 500 });
  }

  const { password } = await req.json();
  if (typeof password === 'string' && password === adminPassword) {
    const response = NextResponse.json({ ok: true });
    return setAdminSessionCookie(response);
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  return clearAdminSessionCookie(response);
}
