'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/stores/useQuizStore';

export default function OX({ quiz }) {
  const router = useRouter();
  const { quizId, regionId, title, answer, explanation } = quiz;
  const [selectBtn, setSelectBtn] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const isCurrect = selectBtn === answer;

  const setAnswer = useQuizStore((s) => s.setAnswer);
  const already = useQuizStore((s) => s.answers[quizId]);

  return (
    <div className="h-screen mx-[16px] flex flex-col">
      {quizId !== 5 && (
        <div className="flex gap-2 pt-28">
          {[0, 1, 2, 3, 4].map((i) => (
            <hr
              key={i}
              className={`w-full py-1 border-none rounded-xl ${i <= Number(quizId) ? 'bg-sub-100 ' : 'bg-sub-15 '}`}
            />
          ))}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center w-full mb-20">
        <p className="font-bold text-2xl text-main-100">Q{quizId + 1}.</p>
        <p className="font-semibold text-xl">{title}</p>
        <div className="flex w-full gap-2 mt-15 font-bold text-xl">
          <button
            className={`w-full text-main-100 px-auto py-15 rounded-xl border ${selectBtn ? 'border-main-100 bg-main-15' : 'border-main-5 bg-main-5'}`}
            onClick={() => setSelectBtn(true)}
          >
            예
          </button>
          <button
            className={`w-full text-sub-100 px-auto py-15 rounded-xl border ${selectBtn === false ? 'border-sub-100 bg-sub-15' : 'border-main-5 bg-sub-5'}`}
            onClick={() => setSelectBtn(false)}
          >
            아니오
          </button>
        </div>
      </div>
      <button
        className="mb-10 bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5 justify-self-end"
        onClick={() => {
          if (selectBtn === null) return;
          setAnswer(quizId, selectBtn, isCurrect);
          setBottomSheetOpen(true);
        }}
        disabled={selectBtn === null || already}
      >
        제출하기
      </button>

      {bottomSheetOpen && (
        <div className="fixed top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] bg-black/25 z-99" />
      )}

      <div
        className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] mx-auto z-100 bg-white rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out ${bottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <p className="text-neutral-900 font-semibold text-lg text-center">
          {isCurrect ? '정답이에요!' : '오답이에요 😭'}
        </p>
        <p className="mt-5 text-base font-normal text-neutral-600 text-justify">
          {explanation}
        </p>
        <button
          className="w-full bg-main-100 font-semibold text-white text-lg rounded-lg py-2 mt-7"
          onClick={() =>
            router.push(`/collection/${regionId}/quiz/${quizId + 1}`)
          }
        >
          다음 퀴즈로
        </button>
      </div>
    </div>
  );
}
