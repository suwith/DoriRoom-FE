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
import Item from '@/components/Item';
import ConfirmModal from '@/components/ConfirmModal';

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
  const [selectBtn, setSelectBtn] = useState(1);
  const [selectedItemIdx, setSelectedItemIdx] = useState(null);
  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);

  const filteredItems = dummyItems.filter(
    (item) => item.categoryId === selectBtn
  );

  const categoryBtns = [
    { id: 1, name: '의상', icon: FaShirt },
    { id: 2, name: '선반', icon: FaBoxes },
    { id: 3, name: '시계', icon: FaClock },
    { id: 4, name: '창문', icon: FaWindowMaximize },
    { id: 5, name: '모자', icon: FaHatCowboy },
    { id: 6, name: '신발', icon: FaShoePrints },
  ];

  function handleConfirm() {
    console.log('구매 API 호출');
  }

  return (
    <div className="flex justify-center h-screen pt-[30px]">
      <div className="flex flex-col max-w-[390px] mx-auto">
        {/* 상단 고정: 보유 포인트 (왼쪽 정렬) */}
        <div className="sticky top-0 z-10 pt-4 pb-2 pl-3">
          <div
            className="flex justify-center items-center max-w-[70px] gap-2 py-1 rounded-lg"
            style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
          >
            <FaFire className="ml-1 trnsform scale-x-[-1] text-emerald-400 w-5 h-5" />
            <span className="font-bold text-emerald-400 text-lg">70</span>
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
        <div className="flex justify-end my-5 pr-3">
          <button
            disabled={selectedItemIdx === null}
            className={`flex gap-2 items-center justify-center rounded-xl px-4 py-2 ${selectedItemIdx === null ? 'bg-neutral-300' : 'bg-emerald-400'}`}
            onClick={() => setIsOpenBuyModal(true)}
          >
            <RiWallet3Fill className="fill-white" size={20} />
            <p className="font-bold text-[14px]">구입하기</p>
          </button>
        </div>
        {/* 카테고리 버튼 */}
        <div className="shrink-0 my-5 flex gap-2 px-2 overflow-x-auto scrollbar-hide">
          {categoryBtns.map(({ id, name, icon: Icon }) => {
            const isActive = selectBtn === id;

            return (
              <button
                key={id}
                onClick={() => setSelectBtn(id)}
                className={`shrink-0 flex gap-2 items-center justify-center rounded-t px-5 py-2  min-h-[44px] ${
                  isActive ? 'bg-white' : 'bg-neutral-200'
                }`}
              >
                <Icon
                  className={`text-xl ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                />
                <p
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400'
                  }`}
                >
                  {name}
                </p>
              </button>
            );
          })}
        </div>

        {/* 아이템 리스트 (스크롤 영역) */}
        <div className="grow overflow-y-auto px-3 pb-[80px] grid grid-cols-3 gap-2 bg-white scrollbar-hide">
          {dummyItems
            .filter((item) => item.categoryId === selectBtn)
            .map((item) => (
              <Item
                key={item.id}
                onClick={() => setSelectedItemIdx(item.id)}
                isSelected={selectedItemIdx === item.id}
                price={item.price}
                icon={item.icon}
                name={item.name}
              />
            ))}
        </div>
      </div>
      {isOpenBuyModal && (
        <ConfirmModal
          isOpen={isOpenBuyModal}
          onConfirm={handleConfirm}
          message={'8 도깨비불로 장미 머리띠를 구매하시겠습니까?'}
          setIsOpen={setIsOpenBuyModal}
        />
      )}
    </div>
  );
}
