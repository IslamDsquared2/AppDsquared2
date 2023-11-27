
import './globals.css'
import { Inter } from 'next/font/google'
import { LoadingProvider } from './Context/LoadingContext';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dsquared2 ListApp 🏠',
  description: 'List of app inside dsquared2 world',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <LoadingProvider>
      <body className={inter.className}>{children}</body>
      </LoadingProvider>
    </html>

  )
}
