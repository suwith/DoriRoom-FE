export default function AlertBox({ noti }) {
  return (
    <div
      className={`w-screen p-4 ${noti.isRead ? 'bg-background' : 'bg-main-5'}`}
    >
      <div className="flex gap-5">
        <img
          src="/images/alertImage.svg"
          className="w-[52px] h-[52px] rounded-full"
        />
        <div className="flex flex-col w-full">
          <p className="font-normal text-sm">{noti.content}</p>
          <p className="self-end font-normal text-xs text-neutral-400">
            {noti.createdAt}
          </p>
        </div>
      </div>
    </div>
  );
}
