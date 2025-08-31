'use client';

import { useParams } from 'next/navigation';
import useFestivalDetail from '@/hooks/festival/useFestivalDetail';
import FestivalDetail from '@/app/festival/_components/FestivalDetail';

export default function FestivalPage() {
  const params = useParams(); // { festivalId: '...' } 형태
  const festivalId = Array.isArray(params.festivalId)
    ? params.festivalId[0]
    : params.festivalId;

  const { festival, loading, error } = useFestivalDetail(festivalId);

  if (!festivalId) return <div className="p-4">잘못된 접근입니다.</div>;
  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4">에러가 발생했습니다.</div>;
  if (!festival) return <div className="p-4">존재하지 않는 축제입니다.</div>;

  return <FestivalDetail festival={festival} />;
}
