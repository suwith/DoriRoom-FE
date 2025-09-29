'use client';

import EditHeaderNavBar from '@/app/mypage/_components/EditHeaderNavBar';
import usePutSpeech from '@/hooks/user/usePutSpeech';
import LoadingContent from '@/app/_components/LoadingContent';
import { useToast } from '@/app/_providers/ToastProvider';
import { useEffect, useState } from 'react';

export default function page() {
  const [context, setContext] = useState('');
  const { mutate, data, loading, error } = usePutSpeech();
  const { show } = useToast();

  useEffect(() => {
    if (data?.statusCode === 400) show(data?.error);
    else if (data?.statusCode === 200)
      show({
        message: '한줄소개가 정상적으로 등록되었어요!',
        variant: 'success',
      });
  }, [data]);

  if (loading) return <LoadingContent loading={loading} />;

  return (
    <div className="w-screen h-screen px-4 pt-28">
      <EditHeaderNavBar
        title="한줄소개"
        onClick={async () => {
          await mutate({ speechBubble: context });
        }}
      />
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
