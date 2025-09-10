'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSubmitQuiz from '@/hooks/collection/useSubmitQuiz';
import LoadingContent from '@/app/_components/LoadingContent';

export default function OX({ quiz, setSequence, setIsStart, quizCount }) {
  const router = useRouter();
  const { questionId, sequence, content } = quiz;
  const [selectBtn, setSelectBtn] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const { mutate, data, loading, error } = useSubmitQuiz({
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <div className="h-screen mx-4 flex flex-col">
      {Number(sequence) !== Number(quizCount) && (
        <div className="flex gap-2 pt-28">
          {Array.from({ length: quizCount }, (v, i) => i + 1).map((i) => (
            <hr
              key={i}
              className={`w-full py-1 border-none rounded-xl ${i <= Number(sequence) ? 'bg-sub-100 ' : 'bg-sub-15 '}`}
            />
          ))}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center w-full mb-20">
        <p className="font-bold text-2xl text-main-100">Q{sequence}.</p>
        <p className="font-semibold text-xl">{content}</p>
        <div className="flex w-full gap-2 mt-15 font-bold text-xl">
          <button
            className={`w-full text-main-100 mx-auto py-15 rounded-xl border ${selectBtn === 1 ? 'border-main-100 bg-main-15' : 'border-main-5 bg-main-5'}`}
            onClick={() => setSelectBtn(1)}
          >
            예
          </button>
          <button
            className={`w-full text-sub-100 mx-auto py-15 rounded-xl border ${selectBtn === 2 ? 'border-sub-100 bg-sub-15' : 'border-main-5 bg-sub-5'}`}
            onClick={() => setSelectBtn(2)}
          >
            아니오
          </button>
        </div>
      </div>
      <button
        className="mb-10 bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5 justify-self-end"
        onClick={() => {
          if (selectBtn === null) return;
          mutate({
            questionId: questionId,
            submittedAnswer: selectBtn,
          });
          setBottomSheetOpen(true);
        }}
        disabled={selectBtn === null || loading}
      >
        제출하기
      </button>

      <div
        className={`fixed top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full ransition-colors duration-300 ${bottomSheetOpen ? 'bg-black/25 z-99' : 'bg-black/0 -z-1'}`}
      />

      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full mx-auto z-100 bg-white rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {loading ? (
          <LoadingContent loading={loading} />
        ) : error ? (
          <div>제출 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.</div>
        ) : (
          <>
            <p className="text-neutral-900 font-semibold text-lg text-center">
              {data?.isCorrect ? '정답이에요!' : '오답이에요 😭'}
            </p>
            <p className="mt-5 text-base font-normal text-neutral-600 text-justify">
              {data?.commentary}
            </p>
            <button
              className="w-full bg-main-100 font-semibold text-white text-lg rounded-lg py-2 mt-7"
              onClick={
                data?.isCorrect
                  ? () => {
                      setSequence((prev) => prev + 1);
                      setBottomSheetOpen(false);
                      setSelectBtn(null);
                    }
                  : () => {
                      setSequence(1);
                      setIsStart(false);
                    }
              }
            >
              {data?.isCorrect ? '다음 퀴즈로' : '처음으로 돌아가기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
