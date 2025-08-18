'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/stores/useQuizStore';

export default function Choices({ quiz }) {
  const router = useRouter();
  const { quizId, regionId, title, options, answer, explanation } = quiz;
  const [selectBtn, setSelectBtn] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const isCurrect = selectBtn === answer;

  const setAnswer = useQuizStore((s) => s.setAnswer);
  const already = useQuizStore((s) => s.answers[quizId]);
  const reset = useQuizStore((s) => s.reset);

  const routeHandler = () => {
    if (isCurrect) router.push(`/collection/${regionId}/quiz/${quizId + 1}`);
    else {
      reset();
      router.push(`/collection/${regionId}/quiz/`);
    }
  };
  return (
    <div className="h-screen mx-4 flex flex-col">
      {quizId !== 5 && (
        <div className="flex gap-2 pt-28">
          {[0, 1, 2, 3, 4].map((i) => (
            <hr
              key={i}
              className={`w-full py-1 border-none rounded-xl ${
                i <= Number(quizId) ? 'bg-sub-100' : 'bg-sub-15'
              }`}
            />
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center mb-20">
        <p className="font-bold text-2xl text-main-100">Q{quizId + 1}.</p>
        <p className="font-semibold text-xl">{title}</p>
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
        className="mb-10 bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5"
        onClick={() => {
          if (selectBtn === null) return;
          setAnswer(quizId, selectBtn, isCurrect);
          setBottomSheetOpen(true);
        }}
        disabled={selectBtn === null || already}
      >
        제출하기
      </button>

      <div
        className={`fixed top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] transition-colors duration-300 ${bottomSheetOpen ? 'bg-black/25 z-99' : 'bg-black/0 -z-1'}`}
      />

      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto z-100 bg-white rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out ${
          bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <p className="text-neutral-900 font-semibold text-lg text-center">
          {isCurrect ? '정답이에요!' : '오답이에요 😭'}
        </p>
        <p className="mt-5 text-base font-normal text-neutral-600 text-justify">
          {explanation}
        </p>
        <button
          className="w-full bg-main-100 font-semibold text-white text-lg rounded-lg py-2 mt-7"
          onClick={routeHandler}
        >
          {isCurrect ? '다음 퀴즈로' : '처음으로 돌아가기'}
        </button>
      </div>
    </div>
  );
}
