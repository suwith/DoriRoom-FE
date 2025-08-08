'use client';

import React, { useState } from 'react';
import { MdEditSquare } from 'react-icons/md';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import 'react-day-picker/lib/style.css';
import { format } from 'date-fns';
import SelectDate from '@/app/diary/write/_components/SelectDate';

export default function DiaryWrite() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [images, setImages] = useState([]);
  const [diaryText, setDiaryText] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const isFormValid =
    selectedDate && selectedFestival && diaryText.trim() !== '';

  const isWriting = selectedDate || selectedFestival || diaryText.trim() !== '';

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const totalFiles = [...images, ...newFiles].slice(0, 5);
    setImages(totalFiles);
  };

  return (
    <div className="min-h-screen pt-20">
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[10px] bg-background">
        <div className="relative flex items-center justify-center mx-auto">
          <h1 className="text-lg font-semibold text-gray-800">일기 작성하기</h1>

          {/* 뒤로가기 버튼 */}
          <div className="absolute left-5">
            <button
              onClick={() => {
                isWriting ? setShowLeaveModal(true) : history.back();
              }}
              className={`cursor-pointer flex items-center gap-1 text-neutral-500`}
            >
              <i className="mgc_left_line text-3xl" />
            </button>
          </div>
        </div>
      </header>
      <div className="space-y-5 px-4 pt-4 pb-7">
        {/* 축제 검색 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            🧐 어떤 페스티벌에 방문하셨나요?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 text-sm bg-neutral-100 rounded-md px-3 py-2 placeholder:text-neutral-300"
              placeholder="페스티벌 찾기"
              value={selectedFestival}
              onChange={(e) => setSelectedFestival(e.target.value)}
            />
            <button className="bg-main-100 text-background px-5 py-3 text-[15px] rounded-lg">
              검색
            </button>
          </div>
        </div>

        {/* 날짜 선택 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            📅 어느 날짜에 방문하셨나요?
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              type="text"
              className="flex-1 rounded-md bg-neutral-100 text-sm px-3 py-2 placeholder:text-neutral-300"
              placeholder="00-00-00"
              value={selectedDate ? format(selectedDate, 'yy-MM-dd') : ''}
            />

            <button
              className="bg-main-100 text-background px-5 py-3 text-[15px] rounded-lg"
              onClick={() => setShowCalendar(true)}
            >
              선택
            </button>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            📗 축제에 대한 일기를 작성해 주세요
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <div className="min-w-[120px] min-h-[120px] w-[120px] h-[120px] flex-shrink-0 rounded-md bg-neutral-100 border border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative">
              <label className="flex flex-col items-center justify-center text-xs text-neutral-400 cursor-pointer">
                <i className="mgc_camera_fill text-2xl mb-1" />
                사진 추가하기
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {[...images, ...Array(5 - images.length).fill(null)].map(
              (img, i) => (
                <div
                  key={i}
                  className="min-w-[120px] min-h-[120px] w-[120px] h-[120px] flex-shrink-0 rounded-md bg-neutral-100 border border-dashed border-neutral-300  flex items-center justify-center overflow-hidden relative"
                >
                  {img ? (
                    <>
                      <img
                        src={URL.createObjectURL(img)}
                        className="object-cover w-full h-full"
                      />
                      <button
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="absolute top-1 right-1 bg-main-5 bg-opacity-50 text-main-40 rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </>
                  ) : null}
                </div>
              )
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            * 사진은 최대 5장까지 등록이 가능해요!
          </p>
        </div>

        {/* 내용 입력 */}
        <textarea
          className="w-full min-h-[250px] text-sm bg-neutral-100 rounded-lg px-4 py-4 resize-none"
          placeholder="내용 입력하기"
          value={diaryText}
          onChange={(e) => setDiaryText(e.target.value)}
        />

        {/* 공개 범위 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            🔒 공개 범위를 설정해 주세요
          </p>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-1">
              전체공개
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={visibility === 'public'}
                onChange={() => setVisibility('public')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
            <label className="flex items-center gap-1">
              이웃공개
              <input
                type="radio"
                name="visibility"
                value="friends"
                checked={visibility === 'friends'}
                onChange={() => setVisibility('friends')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
            <label className="flex items-center gap-1">
              나만보기
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={visibility === 'private'}
                onChange={() => setVisibility('private')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
          </div>
        </div>

        {/* 업로드 버튼 */}
        <button
          disabled={!isFormValid}
          className={`w-full py-2 rounded-lg font-bold text-sm text-background ${isFormValid ? 'bg-main-100' : 'bg-neutral-300 cursor-not-allowed'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <MdEditSquare className="text-background w-5 h-5" />
            <span className="text-lg">업로드하기</span>
          </div>
        </button>
      </div>

      {showCalendar && (
        <SelectDate
          selectedDate={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {showLeaveModal && (
        <TwoButtonModal
          title="앗, 이대로 나가시겠어요?"
          description="작성하던 글이 사라져요 😭"
          cancelText="계속 작성할래요"
          onCancel={() => setShowLeaveModal(false)}
          confirmText="다음에 쓸게요"
          onConfirm={() => history.back()}
        />
      )}
    </div>
  );
}