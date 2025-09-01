// app/_providers/KeyboardInsetsProvider.jsx
'use client';

import { useEffect } from 'react';

export default function KeyboardInsetsProvider({ children }) {
  useEffect(() => {
    const docStyle = document.documentElement.style;

    function apply() {
      // iOS/안드로이드 모두 대응: visualViewport가 있으면 그 높이를 기준으로 --vh 설정
      const vv = window.visualViewport;
      const height = vv ? vv.height : window.innerHeight;
      const offsetTop = vv ? vv.offsetTop : 0;

      // 키보드가 차지하는 영역 추정
      const kb = Math.max(0, window.innerHeight - height - offsetTop);

      docStyle.setProperty('--vh', `${height * 0.01}px`);
      docStyle.setProperty('--kb-offset', `${kb}px`);
    }

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', apply);
      window.visualViewport.addEventListener('scroll', apply);
    }

    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', apply);
        window.visualViewport.removeEventListener('scroll', apply);
      }
    };
  }, []);

  return children;
}
