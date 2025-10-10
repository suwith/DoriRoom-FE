'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSubmitQuiz from '@/hooks/collection/useSubmitQuiz';
import LoadingContent from '@/app/_components/LoadingContent';

export default function Choices({ quiz, setSequence, setIsStart, quizCount }) {
  const router = useRouter();
  const { questionId, sequence, content, option1, option2, option3, option4 } =
    quiz;
  const { mutate, data, loading, error } = useSubmitQuiz({
    onSuccess: () => {},
    onError: () => {},
  });

  const [selectBtn, setSelectBtn] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const options = [option1, option2, option3, option4];
  return (
    <div className="h-screen mx-4 flex flex-col">
      {
        <div className="flex gap-2 pt-28">
          {Array.from({ length: Number(quizCount) }, (v, i) => i + 1).map(
            (i) => (
              <hr
                key={i}
                className={`w-full py-1 border-none rounded-xl ${
                  i <= Number(sequence) ? 'bg-sub-100' : 'bg-sub-15'
                }`}
              />
            )
          )}
        </div>
      }

      <div className="flex-1 flex flex-col justify-center">
        <p className="font-bold text-2xl text-main-100">Q{sequence}.</p>
        <p className="font-semibold text-xl">{content}</p>
        <div className="flex flex-col gap-2 mt-10 font-bold text-xl w-full">
          {Object.entries(options).map(([key, value]) => (
            <div
              key={key}
              className={`w-full text-main-100 font-medium text-center text-base py-2.5 rounded-lg border ${
                key === selectBtn
                  ? 'border-main-100 bg-main-15'
                  : 'border-main-5 bg-main-5'
              }`}
              onClick={() => setSelectBtn(key)}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <button
        className="mb-[30px] bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5"
        onClick={() => {
          if (selectBtn === null) return;
          mutate({
            questionId: questionId,
            submittedAnswer: Number(selectBtn) + 1,
          });
          setBottomSheetOpen(true);
        }}
        disabled={selectBtn === null}
      >
        제출하기
      </button>

      <div
        className={`fixed top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full transition-colors duration-300 ${bottomSheetOpen ? 'bg-black/25 z-99' : 'bg-black/0 -z-1'}`}
      />

      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full mx-auto z-100 bg-white rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out ${
          bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {loading ? (
          <LoadingContent loading={loading} />
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
