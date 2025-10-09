'use client';

import { useRouter } from 'next/navigation';
import { GoHeartFill } from 'react-icons/go';
import RegionSection from './_components/RegionSection';
import FestivalCardSection from './_components/FestivalCardSection';
import 'mingcute_icon/font/Mingcute.css';
import useMainFestivals from '@/hooks/festival/useMainFestivals';
import FestivalCardSectionSkeleton from '@/app/festival/_components/FestivalCardSectionSkeleton';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

const bannerImages = [
  {
    src: '/images/festival/banner1.svg',
    link: '/festival/abcc55a2-84b8-4107-b80b-73e0d1ea1627',
  },
  {
    src: '/images/festival/banner2.svg',
    link: '/festival/d3af3a7a-5385-49b8-bda3-b57a8fda1c19',
  },
  {
    src: '/images/festival/banner3.svg',
    link: '/festival/add51933-faec-4c85-afb9-a52f6dbd09e3',
  },
];

export default function FestivalPage() {
  const router = useRouter();
  const { popular, upcoming, endingSoon, loading, error } = useMainFestivals();

  return (
    <div className="w-screen appbar-padding-t layout-padding-b ">
      {/* 상단 검색바 + 하트 */}
      <div className="flex items-center gap-1 px-4">
        <div
          onClick={() => router.push('/festival/search')}
          className="flex items-center flex-grow bg-neutral-100 px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          <i className="mgc_search_2_fill text-neutral-400 text-lg mr-2" />
          <span className="text-[13px] text-neutral-500">
            방문하고 싶은 축제를 검색해 보세요!
          </span>
        </div>

        <button className="p-1">
          <GoHeartFill
            className="text-main-100 w-5 h-5"
            onClick={() => router.push(`/festival/bookmarks`)}
          />
        </button>
      </div>

      {/* 배너 */}
      <div className="mt-4 px-4 w-full h-72">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-full rounded-md"
        >
          {bannerImages.map((banner, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={banner.src}
                alt={`banner-${idx}`}
                className="w-full h-full object-contain rounded-md cursor-pointer"
                onClick={() => router.push(banner.link)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 지역 선택 */}
      <div className="mt-4 px-4 overflow-x-auto no-scrollbar">
        <RegionSection />
      </div>

      {/* 로딩 시 스켈레톤 */}
      {loading && (
        <>
          <FestivalCardSectionSkeleton title="지금 뜨는 축제 🔥" count={4} />
          <FestivalCardSectionSkeleton
            title="따끈따끈 신규 축제 🌟"
            count={4}
          />
          <FestivalCardSectionSkeleton
            title="곧 있으면 끝나요! 마감 임박 축제 🚨"
            count={4}
          />
        </>
      )}

      {/* 섹션 */}
      {!loading && !error && (
        <>
          <FestivalCardSection title="지금 뜨는 축제 🔥" festivals={popular} />
          <FestivalCardSection
            title="따끈따끈 신규 축제 🌟"
            festivals={upcoming}
          />
          <FestivalCardSection
            title="곧 있으면 끝나요! 마감 임박 축제 🚨"
            festivals={endingSoon}
          />
        </>
      )}
    </div>
  );
}
