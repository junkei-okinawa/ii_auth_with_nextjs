import type { AppProps } from 'next/app'
import { AuthProvider } from '@src/hooks/auth'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp;