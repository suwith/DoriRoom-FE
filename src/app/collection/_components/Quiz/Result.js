import Link from 'next/link';

export default function Result({ quiz }) {
  const { exp, credit } = quiz.reward;
  return (
    <div className="max-w-[390px] w-screen h-screen bg-linear-to-t from-main-100/15 to-background">
      <div className="h-screen relative mx-[16px]">
        <div className="absolute top-3/7 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full">
          <p className="font-medium text-2xl text-neutral-900">축하드려요!</p>
          <p className="font-semibold text-2xl text-neutral-900">
            모든 퀴즈를 맞히셨어요 🎉
          </p>
          <p className="mt-3 font-normal text-base text-main-100">
            보상으로 {exp}xp와 {credit} 도깨비불이 지급돼요.
          </p>
          <img
            src="/character.png"
            alt="character"
            className="mt-15 mx-auto block"
          />
        </div>
        <Link
          className="absolute bottom-10 bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5 justify-self-end"
          href={`/collection/`}
        >
          퀴즈 시작하기
        </Link>
      </div>
    </div>
  );
}
