'use client';

import EditHeaderNavBar from '@/app/mypage/_components/EditHeaderNavBar';
import { useState } from 'react';

export default function page() {
  const [context, setContext] = useState('');
  return (
    <div className="w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar title="한줄소개" />
      <div className="space-y-4">
        <p className="font-semibold text-base">한줄소개를 입력해 주세요.</p>
        <div className="bg-neutral-100 rounded-lg p-4 font-medium">
          <textarea
            className="focus:outline-none h-10 w-full text-sm"
            placeholder="내용 입력하기"
            maxLength={30}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <p className="text-right text-sm text-neutral-400">
            ({context.length}/30자)
          </p>
        </div>
      </div>
    </div>
  );
}
