import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';

const comments = [
  '1000xp를 달성할 때마다 레벨이 한 단계씩 올라가요',
  '10레벨을 달성할 때마다 한정 아이템이 지급돼요',
  'xp와 도깨비불은 과제 난이도와 비례해요',
];

export default function TaskInfoModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;
  const portalElement = document.getElementById('main');

  return createPortal(
    <div className="max-w-[390px] w-full fixed top-0 bottom-0 bg-black/50 flex justify-center items-center z-50">
      <div className="flex flex-col items-center bg-background p-5 rounded-lg w-[90%]">
        <div className="flex items-center justify-between w-full mb-5">
          <div className="w-[13px]"></div>
          <span className="text-neutral-900 font-normal font-semibold text-lg">
            레벨업 안내
          </span>
          <div
            className="bg-main-5 rounded-full p-1"
            onClick={() => setIsOpen(false)}
          >
            <FaXmark
              size={13}
              className="font-bold text-main-100"
              onClick={() => {}}
            />
          </div>
        </div>
        <img src="/images/items/bear1.png" />
        <div className="flex gap-2 justify-center items-center font-semibold">
          <div className="bg-sub-5 px-1 py-1 text-sm font-semibold text-sub-100">
            한정판 ✨
          </div>
          <p className="text-lg text-main-100">반달가슴곰 인형</p>
        </div>
        <div className="space-y-2 w-full mt-5">
          {comments.map((comment, idx) => (
            <div
              key={idx}
              className="bg-neutral-100 px-3 py-1.5 font-normal text-xs rounded-md"
            >
              {comment}
            </div>
          ))}
        </div>
      </div>
    </div>,
    portalElement
  );
}
