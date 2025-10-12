import './globals.css';
import BottomNavBar from './_components/BottomNavBar';
import AuthBootstrap from '@/app/_providers/AuthBootstrap';
import ToastProvider from './_providers/ToastProvider';
import KeyboardInsetsProvider from '@/app/_providers/KeyboardInsetsProvider';
import Script from 'next/script';
import VisitChallengeProvider from '@/app/_providers/VisitChallengeProvider';
import PushSetup from './_components/PushSetup';

export const API = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOMAP_JAVASCRIPT_KEY}&autoload=false`;

export const metadata = {
  title: 'Dori Room',
  description: 'Collect festivals and personalize your own space.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="overflow-hidden">
        <KeyboardInsetsProvider>
          <div className="relative w-full mx-auto h-screen flex flex-col">
            <main
              id="main"
              className="flex-1 bg-background overflow-y-auto scrollbar-hide w-full"
            >
              <div className="h-full">
                <AuthBootstrap>
                  <VisitChallengeProvider />
                  <ToastProvider>{children}</ToastProvider>
                </AuthBootstrap>
              </div>
            </main>
            <BottomNavBar />
            <PushSetup />
            <Script src={API} strategy="beforeInteractive" />
          </div>
        </KeyboardInsetsProvider>
      </body>
    </html>
  );
}
