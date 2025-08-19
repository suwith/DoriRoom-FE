'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import GuestbookEntry from './_components/GuestbookEntry';
import BottomInputBox from './_components/BottomInputBox';
import { useState } from 'react';

const initialData = [
  {
    id: 1,
    username: '가나디',
    avatar: '/character.png',
    message: '방이 너무 귀여워요!\n잘 보고 갑니다 💩',
    date: '25.08.15',
  },
  {
    id: 2,
    username: '가나디',
    avatar: '/character.png',
    message:
      '방이 너무 귀여워요! 잘 보고 갑니다 💩\n방이 너무 귀여워요! 잘 보고 갑니다 💩\n방이 너무 귀여워요! 잘 보고 갑니다 💩',
    date: '25.08.15',
  },
  {
    id: 3,
    username: '가나디',
    avatar: '/character.png',
    message: '제 방도 방문해 주세요!',
    date: '25.08.15',
  },
];

export default function GuestBookPage() {
  const [entries, setEntries] = useState(initialData);
  const [context, setContext] = useState('');

  const sendMsg = () => {
    if (context.trim().length === 0) return;

    const newEntry = {
      id: entries.length + 1,
      username: '이재영',
      avatar: '/character.png', // 오타 avater → avatar 수정
      message: context,
      date: '25.08.19',
    };

    // ✅ 새 메시지를 맨 위에 추가
    setEntries([newEntry, ...entries]);
    setContext(''); // 입력창 비우기
  };

  return (
    <div className="max-w-[390px] w-screen h-screen bg-[#F7F7F7]">
      <HeaderNavigationBar title="방명록" className="bg-[#F7F7F7]" />
      <div className="h-[calc(100vh-98px)] pt-[98px] pb-2 space-y-5 bg-[#F7F7F7] overflow-y-auto scrollbar-hide">
        {entries.map((data) => (
          <GuestbookEntry key={data.id} data={data} setEntries={setEntries} />
        ))}
      </div>
      <BottomInputBox
        classname={
          'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] px-4 py-[10px] mb-[34px]'
        }
        context={context}
        setContext={setContext}
        sendMsg={sendMsg}
      />
    </div>
  );
}
