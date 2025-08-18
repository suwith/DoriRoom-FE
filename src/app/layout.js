import './globals.css';
import BottomNavBar from './_components/BottomNavBar';
import Script from 'next/script';
export const API = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=fd8a9c08cac8e120ac0dc37633528343&autoload=false`;

export const metadata = {
  title: 'Dori Room',
  description: 'Collect festivals and personalize your own space.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 overflow-hidden">
        <div className="relative max-w-[390px] w-full mx-auto h-screen flex flex-col border-x border-gray-200">
          {/* 고정된 앱 화면 높이에서 */}
          <main
            id="main"
            className="flex-1 bg-background overflow-y-auto scrollbar-hide w-max"
          >
            <div className="h-full pb-18">{children}</div>
          </main>
          <BottomNavBar />
          <Script src={API} strategy="beforeInteractive" />
        </div>
      </body>
    </html>
  );
}
