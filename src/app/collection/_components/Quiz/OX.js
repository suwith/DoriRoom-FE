'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OX({ quiz }) {
  const router = useRouter();
  const { quizId, regionId, title, answer, explanation } = quiz;
  const [selectBtn, setSelectBtn] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const currect = selectBtn === answer;

  const nextQuiz = () => {
    if (quizId !== 4) {
      router.push(`/collection/${regionId}/quiz/${quizId + 1}`);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] relative mx-[16px]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
        <p className="font-bold text-2xl text-main-100">Q{quizId + 1}.</p>
        <p className="font-semibold text-xl">{title}</p>
        <div className="flex gap-2 mt-15 font-bold text-xl">
          <button
            className={`w-full text-main-100 px-auto py-15 rounded-xl border ${selectBtn ? 'border-main-100 bg-main-15' : 'border-main-5 bg-main-5'}`}
            onClick={() => setSelectBtn(true)}
          >
            예
          </button>
          <button
            className={`w-full text-sub-100 px-auto py-15 rounded-xl border ${!selectBtn ? 'border-sub-100 bg-sub-15' : 'border-main-5 bg-sub-5'}`}
            onClick={() => setSelectBtn(false)}
          >
            아니오
          </button>
        </div>
      </div>
      <button
        className="absolute bottom-10 bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5 justify-self-end"
        onClick={() => {
          setBottomSheetOpen(true);
        }}
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
          {currect ? '정답이에요!' : '오답이에요 😭'}
        </p>
        <p className="mt-5 text-md font-normal text-neutral-600 text-justify">
          {explanation}
        </p>
        <button
          className="w-full bg-main-100 font-semibold text-white text-lg rounded-lg py-2 mt-7"
          onClick={nextQuiz}
        >
          다음 퀴즈로
        </button>
      </div>
    </div>
  );
}
