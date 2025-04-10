import { NextIntlClientProvider } from 'next-intl';
import { isLocale } from '@/i18n/utils';
import { Locale } from '@/i18n/locales';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ToastContainer } from 'react-toastify';

import ClientQueryClientProvider from '@shared/components/ClientQueryClientProvider';
// import TokenRefresh from '@shared/components/TokenRefresh';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
// Local Font Example for Onest
const onestFont = localFont({
  src: [
    {
      path: '../../public/assets/fonts/Onest-Black.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Onest-Black.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/assets/fonts/Onest-Black.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-onest',
});


export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>Full Value</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/images/tree.png" type="image/png" />
      </head>
      <body className={`${onestFont.variable}`}>
        <NextIntlClientProvider>
          <ClientQueryClientProvider>
            {/* <TokenRefresh /> */}
            {children}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              className="text-white"
              draggable
            />
          </ClientQueryClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
