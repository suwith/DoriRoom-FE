export default function OptionModal({
  isOpen,
  setIsOpen,
  guestbookId,
  roomOwnerId,
  DGMutate,
}) {
  if (!isOpen) return;
  return (
    <>
      <div
        className="fixed inset-0 bg-transparent z-50"
        onClick={() => setIsOpen(false)}
      />
      <div
        className="absolute top-8 right-2 bg-background text-neutral-600 font-normal text-base rounded-lg px-8 py-[6px] z-51"
        style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
        onClick={async () => {
          await DGMutate({ guestbookId, roomOwnerId });
          setIsOpen(false);
        }}
      >
        삭제
      </div>
    </>
  );
}
