import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Definisci un array di percorsi pubblici usando espressioni regolari o stringhe semplici
  // Ad esempio, se vuoi che tutti i percorsi siano pubblici eccetto quelli specifici,
  // puoi aggiungere quelle eccezioni qui.
  const publicPaths = [
    /^\/$/, // La home page
  ];

  // Verifica se il percorso corrente corrisponde a uno dei percorsi pubblici definiti
  const isPublicPath = publicPaths.some((path) => path.test(pathname));

  // Se il percorso è pubblico, procedi al prossimo middleware o alla pagina
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Controlla se l'utente è autenticato
  const user = request.cookies.get('user');

  // Se non c'è un utente autenticato, reindirizza alla pagina di accesso
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Assicurati che questo sia il percorso della tua pagina di accesso
    return NextResponse.redirect(url);
  }

  // Se l'utente è autenticato, procedi al prossimo middleware o alla pagina richiesta
  return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)']
};
