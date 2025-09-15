import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';
import manifest from '@/data/manifest.json';

const comments = [
  '1000xp를 달성할 때마다 레벨이 한 단계씩 올라가요',
  '10레벨을 달성할 때마다 한정 아이템이 지급돼요',
  'xp와 도깨비불은 과제 난이도와 비례해요',
];

const regionDetails = [
  { atlasId: 1, name: '서울', areaGroup: 'SEOUL', itemId: 46 },
  { atlasId: 2, name: '경기도', areaGroup: 'GYEONGGI', itemId: 45 },
  { atlasId: 3, name: '강원도', areaGroup: 'GANGWON', itemId: 44 },
  { atlasId: 6, name: '충청도', areaGroup: 'CHUNGNAM', itemId: 42 },
  { atlasId: 5, name: '전라도', areaGroup: 'JEOLLA', itemId: 47 },
  { atlasId: 4, name: '경상도', areaGroup: 'GYEONGSANG', itemId: 43 },
  { atlasId: 7, name: '제주도', areaGroup: 'JEJU', itemId: 41 },
];

export default function TaskInfoModal({ isOpen, setIsOpen, atlases }) {
  if (!isOpen) return null;
  const portalElement = document.getElementById('main');

  const region = regionDetails.find((i) => i.atlasId === atlases?.atlasId);
  const itemInfo = manifest.items?.[region?.itemId];

  return createPortal(
    <div className="w-full fixed top-0 bottom-0 bg-black/50 flex justify-center items-center z-50">
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
        <img src={itemInfo?.asset?.src} className="w-30" />
        <div className="flex gap-2 justify-center items-center font-semibold">
          <div className="bg-sub-5 px-1 py-1 text-sm font-semibold text-sub-100">
            한정판 ✨
          </div>
          <p className="text-lg text-main-100">{itemInfo?.name}</p>
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
