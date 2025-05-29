'use client'
import Cookies from 'js-cookie';

export function isLogin(): boolean {
  const token = Cookies.get('AUTH');
  return !!token;
}
