'use client';

import { useEffect, useRef, useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';
import 'mingcute_icon/font/Mingcute.css';
import BackButton from '@/app/_components/BackButton';
import { MdEditSquare } from 'react-icons/md';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import { useRouter } from 'next/navigation';
import useFestivalFavorite from '@/hooks/festival/useFestivalFavorite';
import useFestivalReviews from '@/hooks/festival/useFestivalReviews';
import LoadingContent from '@/app/_components/LoadingContent';
import useDiaryWritten from '@/hooks/diary/useDiaryWritten';
import Tabs from '@/app/_components/Tabs';
import { useToast } from '@/app/_providers/ToastProvider';

const regionDetails = [
  { atlasId: 1, areaCode: 1 }, // 서울
  { atlasId: 2, areaCode: 2 }, // 인천
  { atlasId: 2, areaCode: 31 }, // 경기
  { atlasId: 3, areaCode: 32 }, // 강원
  { atlasId: 4, areaCode: 4 }, // 대구
  { atlasId: 4, areaCode: 6 }, // 부산
  { atlasId: 4, areaCode: 7 }, // 울산
  { atlasId: 4, areaCode: 35 }, // 경북
  { atlasId: 4, areaCode: 36 }, // 경남
  { atlasId: 5, areaCode: 5 }, // 광주
  { atlasId: 5, areaCode: 37 }, // 전북
  { atlasId: 5, areaCode: 38 }, // 전남
  { atlasId: 6, areaCode: 3 }, // 대전
  { atlasId: 6, areaCode: 8 }, // 세종
  { atlasId: 6, areaCode: 33 }, // 충북
  { atlasId: 6, areaCode: 34 }, // 충남
  { atlasId: 7, areaCode: 39 }, // 제주
];

export default function FestivalDetail({ festival }) {
  const router = useRouter();
  const { show } = useToast();

  const [activeTab, setActiveTab] = useState(0);

  const tabList = ['설명', '일기장'];

  const [isScrolled, setIsScrolled] = useState(false);

  const headerSentinelRef = useRef(null);
  const scrollSentinelRef = useRef(null);

  const HEADER_H = 70;

  const { liked, likeCount, loading, mutating, toggleFavorite } =
    useFestivalFavorite(festival.id, festival.likes);

  const { written, loading: writtenLoading } = useDiaryWritten(festival.id);

  // 이미지 하단 센티넬이 헤더 뒤로 넘어가면 isScrolled = true
  useEffect(() => {
    const el = headerSentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      {
        root: null,
        threshold: 0,
        rootMargin: `-${HEADER_H}px 0px 0px 0px`,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 무한스크롤 옵저버
  useEffect(() => {
    if (activeTab !== 1) return;
    const el = scrollSentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !listLoading) {
          loadMore();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab]); // 의존성 최소화

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
    enabled: activeTab === 1,
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
    if (activeTab === 1) setSort(reviewSort);
  }, [activeTab, reviewSort, setSort]);

  const handleRegionNavigation = () => {
    const { areaCode } = festival;
    const region = regionDetails.find((r) => r.areaCode === areaCode);

    if (region) {
      router.push(`/collection/${region.atlasId}`);
    } else {
      show('해당 지역의 페이지가 존재하지 않습니다.');
    }
  };

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
      <div ref={headerSentinelRef} className="h-px" />

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
          <p
            className="text-neutral-700"
            dangerouslySetInnerHTML={{
              __html: String(festival.price || '').replace(/\n/g, '<br>'),
            }}
          />
        </div>

        {festival.relatedChallengeId && (
          <div
            onClick={handleRegionNavigation}
            className="my-2 px-4 py-4 mt-4 space-y-2 rounded bg-main-5 flex items-center justify-between"
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
      <Tabs
        tabs={tabList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        type="festival"
      />

      {/* 설명 탭 */}
      {activeTab === 0 && (
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
      {activeTab === 1 && (
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

          {/* 로딩/에러/빈 상태 */}
          {listLoading && reviews.length === 0 && (
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

          {/* 리뷰 리스트 */}
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              type="festival"
              onLikeSync={handleLikeSync}
            />
          ))}

          {/*일기 목록 무한 스크롤 센티넬*/}
          <div ref={scrollSentinelRef} className="h-[1px]" />

          {/* 로딩 표시 (하단 로딩 전용) */}
          {listLoading && reviews.length > 0 && (
            <div className="py-4 flex justify-center">
              <LoadingContent loading={listLoading} />
            </div>
          )}

          {/* 작성 버튼 */}
          <button
            className={`fixed btn-fixed-b left-1/2 -translate-x-1/2 w-[90%] py-2 text-background rounded-lg text-sm font-medium shadow-md ${
              written ? 'bg-neutral-300' : 'bg-main-100'
            }`}
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
