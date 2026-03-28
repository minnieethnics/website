import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_COOKIE_NAME = 'me_admin_session';

function getExpectedSessionValue() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;

  return crypto
    .createHash('sha256')
    .update(`minnie-admin:${password}`)
    .digest('hex');
}

export function isAdminRequest(req: NextRequest) {
  const expected = getExpectedSessionValue();
  const actual = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(expected && actual && actual === expected);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function requireAdmin(req: NextRequest) {
  return isAdminRequest(req) ? null : unauthorizedResponse();
}

export function setAdminSessionCookie(res: NextResponse) {
  const expected = getExpectedSessionValue();
  if (!expected) return res;

  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: expected,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return res;
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return res;
}
