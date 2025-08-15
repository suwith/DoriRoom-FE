'use client';

import { useEffect, useState } from 'react';
import { GoHeart, GoHeartFill } from 'react-icons/go';
import Icon from '@mdi/react';
import { mdiTree } from '@mdi/js';
import 'mingcute_icon/font/Mingcute.css';
import clsx from 'clsx';
import BackButton from '@/app/_components/BackButton';
import { MdEditSquare } from 'react-icons/md';
import ReviewItem from '@/app/festival/_components/ReviewItem';
import { useRouter } from 'next/navigation';

export default function FestivalDetail({ festival }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('설명');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(festival.likes || 0);
  const [likedReviews, setLikedReviews] = useState([]);
  const [reviewSort, setReviewSort] = useState('latest');
  const [showToast, setShowToast] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const toggleReviewLike = (reviewId) => {
    setLikedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const sortedReviews = [...festival.reviews].sort((a, b) => {
    if (reviewSort === 'likes') return b.likes - a.likes;
    return new Date(b.date) - new Date(a.date);
  });

  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[390px] mx-auto bg-[#FEFEFE] min-h-screen pb-10">
      {/* 이미지 상단 */}
      <div className="relative">
        <img
          src={festival.thumbnail}
          alt={festival.title}
          className="w-full h-[370px] object-cover"
        />
        <div className="absolute top-10 left-3">
          <BackButton color={'text-background'} isShadow={true} />
        </div>
      </div>

      {/* 정보 */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="font-bold text-[21px] text-neutral-900">
            {festival.title}
          </h1>
          <div className="flex flex-col items-center mt-2">
            <button onClick={handleLike}>
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
          <p className="text-neutral-500">일자</p>
          <span className="text-main-100 bg-main-5 rounded-full px-1.5 py-0.5 flex items-center font-normal text-[11px]">
            {festival.status}
          </span>
          <span>
            {festival.startDate} ~ {festival.endDate}
          </span>
        </div>
        <div className="flex flex-row items-center gap-3 text-sm">
          <p className="text-neutral-500">시간</p>
          <span>
            {festival.startTime} ~ {festival.endTime}
          </span>
        </div>
        <div className="flex flex-row items-center gap-3 text-sm">
          <p className=" text-neutral-500">위치</p>
          <p>{festival.location}</p>
        </div>
        <div className="flex flex-row items-center gap-3 text-sm">
          <p className=" text-neutral-500">주최기관</p>
          <p>{festival.host}</p>
        </div>
        <div className="flex flex-row items-center gap-3 text-sm">
          <p className=" text-neutral-500">금액</p>
          <p>
            {festival.price === 0
              ? '무료'
              : `₩${festival.price.toLocaleString()}`}
          </p>
        </div>
      </div>
      <div className="mt-1 w-full h-1.5 p-0 bg-neutral-100"></div>

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
        <div className="px-4 py-6 space-y-6 text-sm text-neutral-800">
          {festival.details?.map((detail, idx) => (
            <div key={idx}>
              <div className="text-main-100 font-medium mb-1 flex items-center gap-1">
                <Icon path={mdiTree} className="w-4 h-4 text-main-100" />
                {detail.infoname}
              </div>
              <p
                className="text-neutral-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: detail.infotext.replace(/\n/g, '<br />'),
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 일기장 탭 */}
      {activeTab === '일기장' && (
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <p>일기 {festival.reviews.length}개</p>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
              className="text-sm px-2 py-1 text-right text-neutral-500 focus:outline-none"
            >
              <option value="latest">최신순</option>
              <option value="likes">좋아요순</option>
            </select>
          </div>

          {festival.reviews.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <i className="mgc_sweats_fill text-5xl text-main-100" />
              <div className="text-center text-lg font-semibold">
                앗, 아직 작성된 일기가 없어요!
              </div>
            </div>
          )}

          {sortedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              isLiked={likedReviews.includes(review.id)}
              onLike={toggleReviewLike}
            />
          ))}

          <button
            className="fixed bottom-7 left-1/2 -translate-x-1/2 w-[350px] py-2 bg-main-100 text-background rounded-lg text-sm font-medium shadow-md"
            onClick={() => {
              sessionStorage.setItem(
                'selectedFestival',
                JSON.stringify(festival)
              );
              router.push('/diary/write');
            }}
          >
            <div className="flex items-center justify-center gap-2">
              {' '}
              <MdEditSquare className="text-background w-5 h-5" />
              <span className="text-lg">일기 작성하기</span>
            </div>
          </button>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 bg-sub-5 px-4 py-2 rounded-full text-xs text-sub-100 whitespace-nowrap flex items-center gap-2 z-50">
          <i className="mgc_user_follow_fill text-lg text-sub-100" />
          <span>
            {festival.visitedFriend > 0
              ? `${festival.visitedFriend}명의 친구가 해당 장소에 방문했어요!`
              : '아직 방문한 친구가 없어요'}
          </span>
        </div>
      )}
    </div>
  );
}
