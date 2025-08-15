'use client';

import Link from 'next/link';
import { useQuizStore } from '@/stores/useQuizStore';

export default function Result({ quiz }) {
  const { exp, credit } = quiz.reward;
  const score = useQuizStore((s) => s.score);
  const reset = useQuizStore((s) => s.reset);
  return (
    <div className="max-w-[390px] w-screen h-screen mx-auto bg-linear-to-t from-main-100/15 to-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-[16px] text-center">
        <p className="font-medium text-2xl text-neutral-900">축하드려요!</p>
        <p className="font-semibold text-2xl text-neutral-900">
          모든 퀴즈를 맞히셨어요🎉
        </p>
        <p className="mt-3 font-normal text-base text-main-100">
          보상으로 {exp}xp와 {credit} 도깨비불이 지급돼요.
        </p>
        <img
          src="/character.png"
          alt="character"
          className="mt-12 mx-auto block"
        />
      </div>

      <div className="px-[16px] pb-10">
        <Link
          className="block w-full bg-main-100 text-background text-center text-xl font-semibold rounded-md py-2.5"
          href={`/collection/`}
          onClick={() => reset()}
        >
          보상 받기
        </Link>
      </div>
    </div>
  );
}
