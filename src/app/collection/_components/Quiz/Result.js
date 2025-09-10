'use client';

export default function Result({ quiz, regionId }) {
  const success = quiz?.succes;
  const rewards = quiz?.rewards;
  const exp = rewards.find((r) => r.rewardType === 'EXP')?.amount ?? 0;
  const credit = rewards.find((r) => r.rewardType === 'CREDIT')?.amount ?? 0;

  if (!success) return null;

  return (
    <div className="w-screen h-screen mx-auto bg-linear-to-t from-main-100/15 to-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
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

      <div className="px-4 pb-10">
        <button
          className="block w-full bg-main-100 text-background text-center text-xl font-semibold rounded-md py-2.5"
          onClick={() => history.back()}
        >
          보상 받기
        </button>
      </div>
    </div>
  );
}
