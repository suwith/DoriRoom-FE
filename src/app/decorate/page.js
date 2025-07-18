'use client';

import HeaderNavigationBar from '../_components/HeaderNavigationBar';
import { useState } from 'react';
import { FaFire, FaShirt } from 'react-icons/fa6';
import {
  FaHatCowboy,
  FaShoePrints,
  FaClock,
  FaWindowMaximize,
  FaBoxes,
  FaStore,
} from 'react-icons/fa';
import { GoCircleSlash } from 'react-icons/go';
import { RiWallet3Fill } from 'react-icons/ri';
import Item from '@/components/Item';

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

export default function Decorate() {
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
    <div className="flex justify-center items-center h-full">
      <HeaderNavigationBar title="꾸미기" />
      <div className="flex flex-col max-w-[390px] mx-auto">
        {/* 캐릭터 */}
        <div className="shrink-0 mt-70 flex justify-center">
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
            <FaStore className="fill-white" size={20} />
            <p className="font-bold text-[14px]">상점으로</p>
          </button>
        </div>
        {/* 카테고리 버튼 */}
        <div className="shrink-0 mt-5 flex gap-2 px-2 overflow-x-auto scrollbar-hide">
          {categoryBtns.map(({ id, name, icon: Icon }) => {
            const isActive = selectBtn === id;

            return (
              <button
                key={id}
                onClick={() => setSelectBtn(id)}
                className={`shrink-0 flex gap-2 items-center justify-center rounded-t px-5 py-2 min-h-[44px] ${
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
        <div className="overflow-y-auto bg-white px-3 pt-3 pb-[80px] grid grid-cols-3 gap-2 scrollbar-hide">
          <Item
            onClick={() => setSelectedItemIdx(0)}
            isSelected={selectedItemIdx === 0}
            icon={GoCircleSlash}
            name="선택안함"
          />
          {dummyItems
            .filter((item) => item.categoryId === selectBtn)
            .map((item) => (
              <Item
                key={item.id}
                onClick={() => setSelectedItemIdx(item.id)}
                isSelected={selectedItemIdx === item.id}
                icon={item.icon}
                name={item.name}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
