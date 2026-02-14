import localFont from 'next/font/local';

export const pretendard = localFont({
  src: [
    {
      path: './fonts/Pretendard/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Pretendard/Pretendard-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-pretendard',
});

export const caveat = localFont({
  src: [
    {
      path: './fonts/Caveat/Caveat-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Caveat/Caveat-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Caveat/Caveat-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-caveat',
});
