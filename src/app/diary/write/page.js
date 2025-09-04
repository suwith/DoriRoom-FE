'use client';

import React, { useEffect, useState } from 'react';
import { MdEditSquare } from 'react-icons/md';
import TwoButtonModal from '@/app/_components/TwoButtonModal';
import 'react-day-picker/lib/style.css';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { DoriroomImagePicker } from 'doriroom-image-picker';
import { Capacitor } from '@capacitor/core';
import SelectDate from '@/app/diary/write/_components/SelectDate';
import useDiaryCreate from '@/hooks/diary/useDiaryCreate';

const MAX_IMAGES = 5;

export default function DiaryWrite() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [images, setImages] = useState([]);
  const [diaryText, setDiaryText] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const isFormValid =
    selectedDate && selectedFestival?.id && diaryText.trim() !== '';

  const isWriting = selectedDate || selectedFestival || diaryText.trim() !== '';

  const { createDiary, loading: createLoading } = useDiaryCreate();

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // diary JSON을 Blob으로 추가해야 함
      const diaryPayload = {
        eventId: selectedFestival.id,
        visitedAt: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        content: diaryText,
        visibility,
      };
      formData.append(
        'diary',
        new Blob([JSON.stringify(diaryPayload)], { type: 'application/json' })
      );

      // 이미지 파일 추가
      images.forEach((img) => {
        if (img.file) formData.append('images', img.file);
      });

      const newDiary = await createDiary(formData);
      if (newDiary) {
        router.replace(`/diary/${newDiary.diaryId}`);
      }
    } catch (err) {
      console.error('일기 작성 중 오류:', err);
    }
  };

  const toDisplay = (uri) => {
    if (!uri) return '';
    try {
      return typeof Capacitor?.convertFileSrc === 'function'
        ? Capacitor.convertFileSrc(uri)
        : uri;
    } catch {
      return uri;
    }
  };

  /** 이미지 선택 */
  const handleSelectImages = async () => {
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    try {
      const res = await DoriroomImagePicker.pickImages({ limit: remaining });

      let raw = [];
      if (Array.isArray(res?.items)) {
        raw = res.items.filter(Boolean);
      } else if (Array.isArray(res?.paths)) {
        raw = res.paths.map((p) => ({ path: p }));
      } else {
        console.warn('알 수 없는 응답 형태:', res);
        return;
      }

      const selected = raw.map((it) => {
        const uri = it.webPath || it.path || it.uri;
        return {
          uri: toDisplay(uri),
          file: it.file || null, // File 객체를 직접 받는 경우
        };
      });

      setImages((prev) => {
        const merged = [...prev, ...selected];
        const uniq = merged.filter(
          (x, i, a) => a.findIndex((y) => y.uri === x.uri) === i
        );
        return uniq.slice(0, MAX_IMAGES);
      });
    } catch (err) {
      console.error('이미지 선택 실패:', err);
    }
  };

  /** 세션스토리지 복원 */
  useEffect(() => {
    const shouldRestore = sessionStorage.getItem('selectMode') === 'true';

    if (shouldRestore) {
      try {
        const saved = JSON.parse(
          sessionStorage.getItem('diaryWriteForm') || '{}'
        );

        if (saved.selectedDate) {
          const d = new Date(saved.selectedDate);
          if (!isNaN(d.getTime())) setSelectedDate(d);
        }

        if (saved.selectedFestival?.id) {
          setSelectedFestival(saved.selectedFestival);
        }

        if (Array.isArray(saved.images)) {
          setImages(
            saved.images.map((it) => ({
              uri: toDisplay(it?.uri),
              file: null, // 복원 시에는 파일 없음
            }))
          );
        }

        if (typeof saved.diaryText === 'string') setDiaryText(saved.diaryText);
        if (typeof saved.visibility === 'string')
          setVisibility(saved.visibility);
      } catch (e) {
        console.warn('폼 복원 실패:', e);
      } finally {
        sessionStorage.removeItem('selectMode');
      }
    }

    // 검색 페이지에서 선택된 축제 불러오기
    const picked = sessionStorage.getItem('selectedFestival');
    if (picked) {
      try {
        const f = JSON.parse(picked);
        setSelectedFestival(f); // {id, title, thumbnail}
      } catch {}
      sessionStorage.removeItem('selectedFestival');
    }
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 max-w-[390px] w-full pt-[50px] pb-[10px] bg-background">
        <div className="relative flex items-center justify-center mx-auto">
          <h1 className="text-lg font-semibold">일기 작성하기</h1>

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
      <div className="space-y-5 px-4 pt-7 pb-7">
        {/* 축제 검색 */}
        <div>
          <p className="text-[15px] font-semibold mb-3">
            🧐 어떤 페스티벌에 방문하셨나요?
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              type="text"
              className="flex-1 text-sm bg-neutral-100 rounded-md px-3 py-2 placeholder:text-neutral-300 focus:outline-none"
              placeholder="페스티벌 찾기"
              value={selectedFestival?.title || ''}
              onChange={(e) =>
                setSelectedFestival((prev) => ({
                  ...(prev || {}),
                  title: e.target.value,
                }))
              }
            />

            <button
              className="bg-main-100 text-background px-5 py-3 text-[15px] rounded-lg"
              onClick={() => {
                sessionStorage.setItem('selectMode', 'true');
                sessionStorage.setItem(
                  'diaryWriteForm',
                  JSON.stringify({
                    selectedDate: selectedDate?.toISOString?.() || null,
                    selectedFestival,
                    images: images
                      .map((it) => ({ uri: it?.uri }))
                      .filter(Boolean),
                    diaryText,
                    visibility,
                  })
                );
                router.push('/festival/search');
              }}
            >
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
              className="flex-1 rounded-md bg-neutral-100 text-sm px-3 py-2 placeholder:text-neutral-300 focus:outline-none"
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
            {images.length < MAX_IMAGES && (
              <div className="min-w-[120px] min-h-[120px] w-[120px] h-[120px] flex-shrink-0 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden relative">
                <button
                  className="flex flex-col items-center justify-center text-xs text-neutral-400 cursor-pointer"
                  onClick={handleSelectImages}
                >
                  <i className="mgc_camera_fill text-2xl mb-1" />
                  사진 추가하기
                </button>
              </div>
            )}
            {[...images, ...Array(5 - images.length).fill(null)].map(
              (img, i) => (
                <div
                  key={i}
                  className={`min-w-[120px] min-h-[120px] w-[120px] h-[120px] flex-shrink-0 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden relative ${
                    img ? '' : 'border border-dashed border-neutral-300'
                  }`}
                >
                  {img ? (
                    <>
                      <img
                        src={img.uri}
                        alt={`selected-${i}`}
                        className="object-cover w-full h-full"
                      />

                      <button
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                        className="bg-main-5 bg-opacity-50 text-main-100 rounded-full w-5 h-5 p-1 text-xs"
                      >
                        <i className="mgc_close_line" />
                      </button>
                    </>
                  ) : null}
                </div>
              )
            )}
          </div>

          <p className="text-xs text-neutral-400 mt-2 flex">
            • 사진은 최대 5장까지 등록이 가능해요!
          </p>
        </div>

        {/* 내용 입력 */}
        <div className="w-full flex flex-col gap-2 relative bg-neutral-100 rounded-lg px-4 py-3 ">
          <textarea
            className="min-h-[250px] text-sm resize-none placeholder:text-neutral-300 focus:outline-none scrollbar-hide"
            placeholder="내용 입력하기"
            value={diaryText}
            maxLength={500}
            onChange={(e) => setDiaryText(e.target.value.slice(0, 500))}
            aria-describedby="diaryCounter"
          />
          <span
            id="diaryCounter"
            className="text-right text-xs text-neutral-400"
          >
            ({diaryText.length}/500자)
          </span>
        </div>

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
                value="PUBLIC"
                checked={visibility === 'PUBLIC'}
                onChange={() => setVisibility('PUBLIC')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
            <label className="flex items-center gap-1">
              단짝공개
              <input
                type="radio"
                name="visibility"
                value="FRIENDS"
                checked={visibility === 'FRIENDS'}
                onChange={() => setVisibility('FRIENDS')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
            <label className="flex items-center gap-1">
              나만보기
              <input
                type="radio"
                name="visibility"
                value="PRIVATE"
                checked={visibility === 'PRIVATE'}
                onChange={() => setVisibility('PRIVATE')}
                className="w-4 h-4 appearance-none border-1 border-neutral-300 rounded-full checked:bg-main-100 checked:border-2"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col text-xs text-neutral-400 gap-1">
          <p>• 일기 업로드 시 기본으로 3 도깨비불이 지급돼요.</p>
          <p>
            • 사진이 함께 첨부된 일기의 경우 추가로 2 도깨비불을 지급 받을 수
            있어요.
          </p>
        </div>

        <button
          disabled={!isFormValid || createLoading}
          className={`w-full py-2 mt-3 rounded-lg font-bold text-sm text-background ${
            isFormValid ? 'bg-main-100' : 'bg-neutral-300 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
        >
          <div className="flex items-center justify-center gap-2">
            <MdEditSquare className="text-background w-5 h-5" />
            <span className="text-lg">
              {createLoading ? '업로드 중...' : '업로드하기'}
            </span>
          </div>
        </button>
      </div>

      {showCalendar && (
        <button
          className="fixed inset-0 bg-black/25 z-[99]"
          onClick={() => setShowCalendar(null)}
          aria-label="필터 닫기"
        />
      )}
      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[100]
        bg-background rounded-t-xl px-4 py-8 transition-transform duration-300 ease-in-out
        ${showCalendar ? 'translate-y-0' : 'translate-y-[100vh]'}`}
      >
        <SelectDate
          open={showCalendar}
          selectedDate={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          onClose={() => setShowCalendar(false)}
        />
      </div>

      {showLeaveModal && (
        <TwoButtonModal
          title="앗, 이대로 나가시겠어요?"
          description="작성하던 글이 사라져요 😭"
          cancelText="계속 작성할래요"
          onCancel={() => setShowLeaveModal(false)}
          confirmText="다음에 쓸게요"
          onConfirm={() => {
            sessionStorage.removeItem('diaryWriteForm');
            sessionStorage.removeItem('selectMode');
            router.push('/diary/');
          }}
        />
      )}
    </div>
  );
}
