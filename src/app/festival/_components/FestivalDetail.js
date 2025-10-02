'use client';

import { useEffect, useRef, useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';
import 'mingcute_icon/font/Mingcute.css';
import clsx from 'clsx';
import BackButton from '@/app/_components/BackButton';
import { MdEditSquare } from 'react-icons/md';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import { useRouter } from 'next/navigation';
import useFestivalFavorite from '@/hooks/festival/useFestivalFavorite';
import useFestivalReviews from '@/hooks/festival/useFestivalReviews';
import LoadingContent from '@/app/_components/LoadingContent';
import useDiaryWritten from '@/hooks/diary/useDiaryWritten';

export default function FestivalDetail({ festival }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('설명');

  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef(null);
  const HEADER_H = 70;

  const { liked, likeCount, loading, mutating, toggleFavorite } =
    useFestivalFavorite(festival.id, festival.likes);

  const { written, loading: writtenLoading } = useDiaryWritten(festival.id);

  // 이미지 하단 센티넬이 헤더 뒤로 넘어가면 isScrolled = true
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // entry가 보이면 아직 이미지 영역, 안 보이면 정보 영역
        setIsScrolled(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // 헤더 높이만큼 위쪽을 미리 깎아, 헤더와 정확히 맞닿을 때 전환되게 함
        rootMargin: `-${HEADER_H}px 0px 0px 0px`,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const [reviewSort, setReviewSort] = useState('latest');
  const {
    reviews,
    loading: listLoading,
    error: listError,
    setReviews,
    setSort,
    loadMore,
    hasMore,
  } = useFestivalReviews({
    eventId: festival.id,
    enabled: activeTab === '일기장',
    initialSort: reviewSort,
    pageSize: 20,
  });

  const handleLikeSync = (id, liked) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, likes: liked ? r.likes + 1 : Math.max(0, r.likes - 1) }
          : r
      )
    );
  };

  useEffect(() => {
    setSort(reviewSort);
  }, [reviewSort, setSort]);

  return (
    <div className=" w-screen min-h-screen appbar-padding-b">
      <div
        className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full header-padding-t pb-[20px] transition-colors duration-300 ${
          isScrolled ? 'bg-background' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center px-3">
          <BackButton
            color={isScrolled ? 'text-neutral-500' : 'text-background'}
            isShadow={true}
          />
        </div>
      </div>

      {/* 썸네일 */}
      <div className="relative">
        <img
          src={festival.thumbnail || '/images/festivalImage_default.svg'}
          alt={festival.title}
          className="w-full h-[370px] object-cover"
        />
      </div>

      {/* 이미지 바로 아래 센티넬: 이 지점이 헤더 뒤로 넘어갈 때 배경/아이콘 색 전환 */}
      <div ref={sentinelRef} className="h-px" />

      {/* 정보 */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-bold text-[21px] text-neutral-900">
            {festival.title}
          </h1>
          <div className="flex flex-col items-center mt-2">
            <button onClick={toggleFavorite} disabled={loading || mutating}>
              {liked ? (
                <GoHeartFill className="text-main-100 w-5 h-5" />
              ) : (
                <GoHeart className="text-neutral-400 w-5 h-5" />
              )}
            </button>

            <span
              className={`text-[11px] ${liked ? 'text-main-100' : 'text-neutral-400'}`}
            >
              {likeCount}
            </span>
          </div>
        </div>

        <div className="flex flex-row items-center gap-3 text-sm">
          <p className="text-neutral-500 whitespace-nowrap">일자</p>
          <div className="flex flex-row gap-2 items-center">
            <span
              className={`px-1.5 py-[1.8px] rounded-sm flex items-center font-normal text-[11px] ${
                festival.status === '진행 예정'
                  ? 'bg-main-5 text-main-100'
                  : festival.status === '진행 중'
                    ? 'bg-sub-5 text-sub-100'
                    : festival.status === '행사 종료'
                      ? 'bg-neutral-100 text-neutral-300'
                      : ''
              }`}
            >
              {festival.status}
            </span>
            <span>
              {festival.startDate} ~ {festival.endDate}
            </span>
          </div>
        </div>

        <div className="flex flex-row gap-3 text-sm">
          <p className="text-neutral-500 whitespace-nowrap">위치</p>
          <p>{festival.location}</p>
        </div>

        <div className="flex flex-row gap-3 text-sm">
          <p className="text-neutral-500 whitespace-nowrap">주최</p>
          <p>{festival.host}</p>
        </div>

        <div className="flex flex-row gap-3 text-sm">
          <p className="text-neutral-500 whitespace-nowrap">금액</p>
          <p className="text-neutral-700 whitespace-pre-line">
            {String(festival.price || '')}
          </p>
        </div>

        {festival.relatedChallengeId && (
          <div
            onClick={() => router.push('')}
            className="my-2 px-4 py-3 space-y-2 rounded bg-main-5 flex items-center justify-between"
          >
            <div className="flex flex-col justify-start text-sm">
              <span className="text-[16px] font-semibold">
                지역 과제에 해당하는 축제예요!✨
              </span>
              <span className="text-[13px] text-neutral-600 font-normal">
                해당 축제에 방문하면 경험치와 도깨비불을 얻을 수 있어요.
              </span>
            </div>
            <i className="mgc_right_line text-3xl text-neutral-400" />
          </div>
        )}
      </div>

      <div className="mt-1 w-full h-1.5 p-0 bg-neutral-100" />

      {/* 탭 */}
      <div className="flex px-4 border-b-2 border-neutral-100">
        {['설명', '일기장'].map((tab) => (
          <button
            key={tab}
            className={clsx(
              'relative flex-1 text-sm text-center pt-3 pb-[10px]',
              activeTab === tab ? 'text-main-100' : 'text-neutral-300'
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span
              className={clsx(
                'absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-[45px] h-[2px] rounded-full',
                activeTab === tab ? 'bg-main-100' : 'bg-neutral-200'
              )}
            />
          </button>
        ))}
      </div>

      {/* 설명 탭 */}
      {activeTab === '설명' && (
        <div className="px-4 pt-6 space-y-6 text-sm text-neutral-800">
          {festival.thumbnail && (
            <div>
              <img src={festival.thumbnail} alt={festival.title} />
            </div>
          )}

          <div>
            <div className="text-main-100 font-medium mb-1 flex items-center gap-1">
              <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
              행사소개
            </div>
            <p
              className="text-neutral-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (festival.eventIntro || '').replace(/\n/g, '<br />'),
              }}
            />
          </div>
          <div>
            <div className="text-main-100 font-medium mb-1 flex items-center gap-1">
              <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
              행사내용
            </div>
            <p
              className="text-neutral-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (festival.eventContent || '').replace(/\n/g, '<br />'),
              }}
            />
          </div>
        </div>
      )}

      {/* 일기장 탭 */}
      {activeTab === '일기장' && (
        <div className="px-4 pt-4 pb-10 space-y-2">
          <div className="flex items-center justify-between">
            <p>일기 {reviews.length}개</p>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="text-sm px-2 py-1 text-right text-neutral-500 focus:outline-none"
            >
              <option value="latest">최신순</option>
              <option value="likes">좋아요순</option>
            </select>
          </div>

          {listLoading && (
            <div className="py-10 text-center text-neutral-400 text-sm">
              <LoadingContent loading={listLoading} />
            </div>
          )}

          {listError && (
            <div className="py-10 text-center text-red-400 text-sm">
              일기를 불러오지 못했어요.
            </div>
          )}

          {!listLoading && !listError && reviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <i className="mgc_sweats_fill text-5xl text-main-100" />
              <div className="text-center text-lg font-semibold">
                앗, 아직 작성된 일기가 없어요!
              </div>
            </div>
          )}

          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              type="festival"
              onLikeSync={handleLikeSync}
            />
          ))}

          {hasMore && (
            <div className="py-3">
              <button
                type="button"
                onClick={loadMore}
                disabled={listLoading}
                className="w-full py-2 text-sm rounded-md border border-main-100 text-main-100 disabled:opacity-60"
              >
                {listLoading ? '불러오는 중...' : '더 불러오기'}
              </button>
            </div>
          )}

          <button
            className={`fixed btn-fixed-b left-1/2 -translate-x-1/2 w-[90%] py-2 text-background rounded-lg text-sm font-medium shadow-md ${written ? 'bg-neutral-300' : 'bg-main-100'}`}
            onClick={() => {
              sessionStorage.setItem(
                'selectedFestival',
                JSON.stringify(festival)
              );
              router.push('/diary/write');
            }}
            disabled={written}
          >
            <div className="flex items-center justify-center gap-2">
              <MdEditSquare className="text-background w-5 h-5" />
              <span className="text-lg">
                {written ? '이미 일기를 작성했어요' : '일기 작성하기'}
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
