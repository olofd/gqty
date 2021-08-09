import 'remark-admonitions/styles/infima.css';
import 'prism-themes/themes/prism-atom-dark.css';
import '../../public/style.css';

import { appWithTranslation } from 'next-i18next';

import {
  extendTheme,
  theme as chakraTheme,
  Box,
  chakra,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import {
  ExtendComponents,
  handlePushRoute,
  CombinedThemeProvider,
  DocsPage,
  AppSeoProps,
} from '@guild-docs/client';
import { Header, Subheader, Footer } from '@theguild/components';
import Router from 'next/router';
import type { AppProps } from 'next/app';

const BaseAnchor = chakra('a', {
  baseStyle: {
    color: '#2f77c9',
    _hover: {
      textDecoration: 'underline',
    },
  },
});

const a: typeof BaseAnchor = (props) => {
  const localHref =
    typeof props.href === 'string' && props.href.startsWith('/')
      ? props.href
      : undefined;
  return (
    <BaseAnchor
      onClick={
        localHref &&
        ((ev) => {
          ev.preventDefault();
          Router.push(localHref);
        })
      }
      onMouseOver={
        localHref &&
        (() => {
          Router.prefetch(localHref);
        })
      }
      {...props}
    />
  );
};

ExtendComponents({
  HelloWorld() {
    return <p>Hello World!</p>;
  },
  Box,
  a,
});

const styles: typeof chakraTheme['styles'] = {
  global: (props) => ({
    body: {
      bg: mode('white', 'gray.850')(props),
    },
  }),
};

const theme = extendTheme({
  colors: {
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      850: '#1b1b1b',
      900: '#171717',
    },
  },
  fonts: {
    heading: 'TGCFont, sans-serif',
    body: 'TGCFont, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles,
});

const accentColor = '#C00B84';

const serializedMdx = process.env.SERIALIZED_MDX_ROUTES;
const mdxRoutes = { data: serializedMdx && JSON.parse(serializedMdx) };

function AppContent(appProps: AppProps) {
  const { Component, pageProps, router } = appProps;
  const isDocs = router.asPath.startsWith('/docs');

  return (
    <>
      <Header accentColor={accentColor} activeLink="/open-source" themeSwitch />
      <Subheader
        activeLink={router.asPath}
        product={{
          title: '',
          description: '',
          image: {
            src: '/logo/logo.svg',
            alt: 'Docs',
          },
          onClick: (e) => handlePushRoute('/', e),
        }}
        links={[
          {
            children: 'Home',
            title: 'Read about Guild Docs',
            href: '/',
            onClick: (e) => handlePushRoute('/', e),
          },
          {
            children: 'Docs',
            title: 'Check Documentation',
            href: '/docs',
            onClick: (e) => handlePushRoute('/docs/getting-started', e),
          },
        ]}
        cta={{
          children: 'Get Started',
          title: 'Start using GQty',
          href: '/docs/getting-started',
          onClick: (e) => handlePushRoute('/docs/getting-started', e),
          target: '_blank',
          rel: 'noopener noreferrer',
        }}
      />
      {isDocs ? (
        <DocsPage
          appProps={appProps}
          accentColor={accentColor}
          mdxRoutes={mdxRoutes}
          mdxNavigationProps={{
            defaultOpenDepth: 2,
            wrapperProps({ depth }) {
              return depth === 0
                ? {
                    height: 'calc(100vh - 240px)',
                    overflowY: 'auto',
                  }
                : {};
            },
            summaryLabelProps() {
              return {
                textTransform: 'none',
              };
            },
          }}
        />
      ) : (
        <Component {...pageProps} />
      )}
      <Footer />
    </>
  );
}

const AppContentWrapper = appWithTranslation(function TranslatedApp(appProps) {
  return <AppContent {...appProps} />;
});

const defaultSeo: AppSeoProps = {
  title: 'GQty',
  description: 'a GraphQL client built for rapid iteration.',
  logo: {
    url: 'https://gqty.dev/logo.png',
    width: 50,
    height: 54,
  },
};

export default function App(appProps: AppProps) {
  return (
    <CombinedThemeProvider
      theme={theme}
      accentColor={accentColor}
      defaultSeo={defaultSeo}
    >
      <AppContentWrapper {...appProps} />
    </CombinedThemeProvider>
  );
}