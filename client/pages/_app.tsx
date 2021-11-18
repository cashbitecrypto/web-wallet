import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import createEmotionCache from '../src/createEmotionCache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import Head from 'next/head';
import theme from '../src/theme';
import { CssBaseline } from '@mui/material';
import type { EmotionCache } from '@emotion/cache';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

interface AppPropsWithEmotion extends AppProps {
  emotionCache: EmotionCache
}

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
});

const clientSideEmotonCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotonCache }: AppPropsWithEmotion) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ApolloProvider client={client}>
            <CssBaseline/>
            <Component {...pageProps} />
          </ApolloProvider>
        </UserProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
