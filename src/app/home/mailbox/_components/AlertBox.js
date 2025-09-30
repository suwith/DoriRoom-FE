export default function AlertBox() {
  return (
    <div className="bg-main-5 w-screen p-4">
      <div className="flex gap-5">
        <img src="/character.png" className="w-[52px] h-[52px] rounded-full" />
        <div className="flex flex-col">
          <p className="font-normal text-sm">
            도리 님이 '제5회 강릉 비치비어 페스티벌' 일기에 좋아요를 남겼어요.
          </p>
          <p className="self-end font-normal text-xs text-neutral-400">
            2시간 전
          </p>
        </div>
      </div>
    </div>
  );
}
