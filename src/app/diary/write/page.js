// app/diary/write/page.tsx
'use client';

import { useState } from 'react';
import HeaderNavigationBar from '@/app/_components/HeaderNavigationBar';
import { MdEditSquare } from 'react-icons/md';

export default function DiaryWritePage() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [images, setImages] = useState([]);
  const [diaryText, setDiaryText] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const isFormValid =
    selectedDate && selectedFestival && diaryText.trim() !== '';

  return (
    <main className="max-w-[390px] mt-20 mx-auto p-4 font-sans">
      <HeaderNavigationBar title="일기 작성하기" className="bg-background" />

      <div className="space-y-5">
        {/* 축제 검색 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            🧐 어떤 페스티벌에 방문하셨나요?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 text-sm bg-neutral-100 rounded-md px-3 py-2"
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
              type="date"
              className="flex-1 rounded-md bg-neutral-100 text-neutral-400 text-sm px-3 py-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button className="bg-main-100 text-background px-5 py-3 text-[15px] rounded-lg">
              선택
            </button>
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            📗 축제에 대한 일기를 작성해 주세요
          </p>
          <div className="flex gap-2">
            {[...images, ...Array(5 - images.length).fill(null)].map(
              (img, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden relative"
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
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <label className="text-xs text-gray-400 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            setImages((prev) => [...prev.slice(0, 4), file]);
                        }}
                      />
                      사진 추가하기
                    </label>
                  )}
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
          className="w-full min-h-[400px] text-sm bg-neutral-100 rounded px-4 py-4 h-[160px] resize-none"
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

      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow w-[90%] max-w-sm text-center">
            <p className="text-sm font-semibold mb-4">
              앗, 이대로 나가시겠어요?
              <br />
              작성하던 글이 사라져요 😭
            </p>
            <div className="flex justify-around mt-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowLeaveModal(false)}
              >
                계속 작성할래요
              </button>
              <button
                className="px-4 py-2 bg-main-100 text-background rounded"
                onClick={() => {
                  // TODO: 페이지 이동 또는 상태 초기화 처리
                }}
              >
                다음에 쓸게요
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
