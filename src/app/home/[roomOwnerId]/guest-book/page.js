'use client';

import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import GuestbookEntry from './_components/GuestbookEntry';
import BottomInputBox from './_components/BottomInputBox';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import useGuestBookDetail from '@/hooks/guest-book/useGuestBookDetail';
import usePostGuestBook from '@/hooks/guest-book/usePostGuestBook';
import useDeleteGuestBook from '@/hooks/guest-book/useDeleteGuestBook';

export default function GuestBookPage() {
  const params = useParams();
  const roomOwnerId = Array.isArray(params.roomOwnerId)
    ? params.roomOwnerId[0]
    : params.roomOwnerId;

  const [content, setContent] = useState('');
  const {
    guestBook,
    loading: GBLoading,
    error: GBError,
    refetch: GBRefetch,
  } = useGuestBookDetail(roomOwnerId);
  const {
    mutate: PGMutate,
    loading: PGLoading,
    error: PGError,
  } = usePostGuestBook({ onSuccess: () => GBRefetch() });
  const { mutate: DGMutate } = useDeleteGuestBook({
    onSuccess: () => GBRefetch(),
  });

  const sendMsg = async () => {
    if (content.trim().length === 0) return;
    await PGMutate({ roomOwnerId, content });
    setContent('');
  };

  if (!roomOwnerId) return <div className="p-4">잘못된 접근입니다.</div>;
  if (GBError) return <div className="p-4">에러가 발생했습니다.</div>;
  if (!guestBook) return <div className="p-4">방명록이 없습니다.</div>;

  return (
    <div className="max-w-[390px] w-screen h-screen bg-[#F7F7F7]">
      <HeaderNavigationBar title="방명록" className="bg-[#F7F7F7]" />
      {GBLoading ? (
        <div className="text-center">로딩중...</div>
      ) : (
        <div className="h-[calc(100vh-98px)] pt-[98px] pb-2 space-y-5 bg-[#F7F7F7] overflow-y-auto scrollbar-hide">
          {guestBook.map((data, idx) => (
            <GuestbookEntry key={idx} data={data} DGMutate={DGMutate} />
          ))}
        </div>
      )}

      <BottomInputBox
        classname={
          'fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] px-4 py-[10px] mb-[34px]'
        }
        content={content}
        setContent={setContent}
        sendMsg={sendMsg}
      />
    </div>
  );
}
