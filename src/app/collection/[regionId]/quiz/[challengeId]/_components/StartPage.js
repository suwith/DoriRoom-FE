export default function StartPage({ name, setIsStart, quizCount }) {
  return (
    <>
      {/* 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col items-center justify-center px-[16px] text-center">
        <p className="font-medium text-xl">{name} 퀴즈 풀고</p>
        <p className="font-medium text-xl">
          <b>경험치</b>와 <b>도깨비불</b> 받아가세요! ✏️
        </p>
        <p className="mt-2 font-regular text-lg text-main-100">
          {quizCount}문제를 모두 맞혀야 보상을 받을 수 있어요.
          <br />
          여러 번 재도전이 가능하니 참여해 보세요!
        </p>
        <img
          src="/character.png"
          alt="character"
          className="mt-10 mx-auto block"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 appbar-padding-b">
        <button
          className="bg-main-100 text-background text-center text-xl font-semibold rounded-md w-full py-2.5 block"
          onClick={() => setIsStart(true)}
        >
          퀴즈 시작하기
        </button>
      </div>
    </>
  );
}
