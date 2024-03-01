import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log("here")
  const { pathname } = request.nextUrl;

  // Elenco delle pagine pubbliche
  if (pathname.startsWith('/')) {
    return NextResponse.next();
  }

  // Controlla se l'utente è autenticato
  const token = request.cookies.get('user');

  // Se non c'è un token, reindirizza all'accesso
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
