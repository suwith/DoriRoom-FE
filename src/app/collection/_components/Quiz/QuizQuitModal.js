import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export default function QuizQuitModal({ isOpen, setIsOpen, regionId }) {
  const router = useRouter();
  if (!isOpen) return null;
  const portalElement = document.getElementById('main');

  return createPortal(
    <div className="w-full fixed top-0 bottom-0 bg-black/25 flex justify-center items-center z-50">
      <div className="bg-background px-5 pt-8 pb-4 rounded-lg w-[90%] text-center font-semibold text-lg">
        <p className="">퀴즈를 중단하시겠어요?</p>
        <p>지금까지 풀던 내역이 모두 사라져요 😢</p>
        <div className="flex gap-2 mt-10 font-semibold text-xl">
          <button
            className="bg-main-5 text-main-100 rounded-xl w-full py-2.5"
            onClick={() => setIsOpen(false)}
          >
            계속 풀래요
          </button>
          <button
            className="bg-main-100 text-background rounded-xl w-full py-2.5"
            onClick={() => {
              router.replace(`/collection/${regionId}`);
            }}
          >
            중단할래요
          </button>
        </div>
      </div>
    </div>,
    portalElement
  );
}
