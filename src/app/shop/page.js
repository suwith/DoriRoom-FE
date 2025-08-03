'use client';

import { useState } from 'react';
import { FaFire, FaShirt } from 'react-icons/fa6';
import {
  FaHatCowboy,
  FaShoePrints,
  FaClock,
  FaWindowMaximize,
  FaBoxes,
} from 'react-icons/fa';
import { RiWallet3Fill } from 'react-icons/ri';
import ConfirmModal from '@/app/shop/_components/ConfirmModal';
import CategoryItemPanel from '../_components/CategoryItemPanel';

const dummyItems = [
  // 👕 의상
  { id: 101, name: '레트로 셔츠', price: 12000, icon: FaShirt, categoryId: 1 },
  {
    id: 102,
    name: '스트라이프 후드',
    price: 15000,
    icon: FaShirt,
    categoryId: 1,
  },
  { id: 103, name: '여름 반팔티', price: 8000, icon: FaShirt, categoryId: 1 },
  { id: 104, name: '청바지', price: 17000, icon: FaShirt, categoryId: 1 },
  { id: 105, name: '니트 가디건', price: 20000, icon: FaShirt, categoryId: 1 },
  { id: 106, name: '롱패딩', price: 35000, icon: FaShirt, categoryId: 1 },

  // 📦 선반
  { id: 201, name: '우드 선반', price: 18000, icon: FaBoxes, categoryId: 2 },
  { id: 202, name: '화이트 선반', price: 20000, icon: FaBoxes, categoryId: 2 },
  {
    id: 203,
    name: '4단 메탈 선반',
    price: 25000,
    icon: FaBoxes,
    categoryId: 2,
  },

  // 🕰 시계
  { id: 301, name: '벽걸이 시계', price: 12000, icon: FaClock, categoryId: 3 },
  {
    id: 302,
    name: '엔틱 탁상시계',
    price: 16000,
    icon: FaClock,
    categoryId: 3,
  },

  // 🪟 창문
  {
    id: 401,
    name: '블라인드 창문',
    price: 22000,
    icon: FaWindowMaximize,
    categoryId: 4,
  },
  {
    id: 402,
    name: '투명 유리창',
    price: 18000,
    icon: FaWindowMaximize,
    categoryId: 4,
  },
  {
    id: 403,
    name: '하얀 프레임 창문',
    price: 24000,
    icon: FaWindowMaximize,
    categoryId: 4,
  },
  {
    id: 404,
    name: '알루미늄 창문',
    price: 21000,
    icon: FaWindowMaximize,
    categoryId: 4,
  },

  // 🤠 모자
  {
    id: 501,
    name: '카우보이 모자',
    price: 9000,
    icon: FaHatCowboy,
    categoryId: 5,
  },
  { id: 502, name: '비니', price: 7000, icon: FaHatCowboy, categoryId: 5 },
  { id: 503, name: '버킷햇', price: 10000, icon: FaHatCowboy, categoryId: 5 },

  // 👟 신발
  { id: 601, name: '운동화', price: 11000, icon: FaShoePrints, categoryId: 6 },
  { id: 602, name: '부츠', price: 15000, icon: FaShoePrints, categoryId: 6 },
  { id: 603, name: '슬리퍼', price: 6000, icon: FaShoePrints, categoryId: 6 },
  { id: 604, name: '로퍼', price: 13000, icon: FaShoePrints, categoryId: 6 },
  { id: 605, name: '샌들', price: 9000, icon: FaShoePrints, categoryId: 6 },
  { id: 606, name: '축구화', price: 17000, icon: FaShoePrints, categoryId: 6 },
];

export default function Shop() {
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);

  // 유저가 가지고 있는 크레딧
  const credit = 222000;

  const selectedItem = dummyItems.find((item) => item.id === selectedItemIdx);
  function handleConfirm() {
    // 현재 이 유저가 가지고 있는 크레딧 조회
    if (credit >= selectedItem.price) {
      // 구매 요청 API 호출
      alert('구매가 완료되었습니다.');
      setIsOpenBuyModal(false);
    } else {
      alert('크레딧이 부족합니다.');
      setIsOpenBuyModal(false);
    }
  }

  return (
    <div className="flex justify-center h-screen pt-[30px] bg-neutral-100">
      <div className="flex flex-col max-w-[390px] mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="sticky flex top-0 z-10 pt-4 pb-2 pl-3">
          <div
            className="flex justify-center items-center gap-2 py-1 rounded-lg w-auto px-2"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="ml-1 trnsform scale-x-[-1] text-emerald-400 w-5 h-5" />
            <p className="font-bold text-emerald-400 text-lg">{credit}</p>
          </div>
        </div>

        {/* 캐릭터 */}
        <div className="shrink-0 mt-20 flex justify-center">
          <img
            src="/character.png"
            alt="character"
            className="w-[136px] h-[152px]"
          />
        </div>
        <div className="flex justify-end my-5 pr-3 text-white">
          <button
            disabled={selectedItemIdx === null}
            className={`flex gap-2 items-center justify-center rounded-xl px-4 py-2 ${selectedItemIdx === null ? 'bg-neutral-300' : 'bg-emerald-400'}`}
            onClick={() => setIsOpenBuyModal(true)}
          >
            <RiWallet3Fill className="fill-white" size={20} />
            <p className="font-bold text-[14px]">구입하기</p>
          </button>
        </div>

        <CategoryItemPanel
          items={dummyItems}
          selectedItemId={selectedItemIdx}
          onItemSelect={setSelectedItemIdx}
          isShop={true}
        />
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          onConfirm={handleConfirm}
          setIsOpen={setIsOpenBuyModal}
          credit={credit}
          price={selectedItem.price}
          name={selectedItem.name}
        />
      )}
    </div>
  );
}
