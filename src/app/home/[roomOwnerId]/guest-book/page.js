'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import GuestbookEntry from './_components/GuestbookEntry';
import BottomInputBox from './_components/BottomInputBox';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import useGuestBookDetail from '@/hooks/guest-book/useGuestBookDetail';
import useMyInfo from '@/hooks/room/useMyInfo';

export default function GuestBookPage() {
  const params = useParams();
  const roomOwnerId = Array.isArray(params.roomOwnerId)
    ? params.roomOwnerId[0]
    : params.roomOwnerId;

  const [context, setContext] = useState('');
  const {
    guestBook,
    loading: GBLoading,
    error: GBError,
  } = useGuestBookDetail(roomOwnerId);

  const sendMsg = () => {
    if (context.trim().length === 0) return;

    const newEntry = {
      id: entries.length + 1,
      username: '이재영',
      avatar: '/character.png',
      message: context,
      date: '25.08.19',
    };

    setEntries([newEntry, ...entries]);
    setContext('');
  };

  if (!roomOwnerId) return <div className="p-4">잘못된 접근입니다.</div>;
  if (GBLoading) return <div className="p-4">로딩 중...</div>;
  if (GBError) return <div className="p-4">에러가 발생했습니다.</div>;
  if (!guestBook) return <div className="p-4">존재하지 않는 축제입니다.</div>;

  return (
    <div className="max-w-[390px] w-screen h-screen bg-[#F7F7F7]">
      <HeaderNavigationBar title="방명록" className="bg-[#F7F7F7]" />
      <div className="h-[calc(100vh-98px)] pt-[98px] pb-2 space-y-5 bg-[#F7F7F7] overflow-y-auto scrollbar-hide">
        {guestBook.map((data) => (
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
