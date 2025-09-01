'use client';

import { useParams } from 'next/navigation';
import useFestivalDetail from '@/hooks/festival/useFestivalDetail';
import FestivalDetail from '@/app/festival/_components/FestivalDetail';
import LoadingModal from '@/app/_components/LoadingModal';
import ErrorContent from '@/app/_components/ErrorContent';

export default function FestivalPage() {
  const params = useParams(); // { festivalId: '...' } 형태
  const festivalId = Array.isArray(params.festivalId)
    ? params.festivalId[0]
    : params.festivalId;

  const { festival, loading, error } = useFestivalDetail(festivalId);

  if (!festivalId) return <div className="p-4">잘못된 접근입니다.</div>;
  if (loading) return <LoadingModal open={loading} />;
  if (error)
    return <ErrorContent error="앗, 데이터를 불러오는 중 오류가 발생했어요!" />;
  if (!festival) return <ErrorContent error="앗, 존재하지 않는 축제예요!" />;

  return <FestivalDetail festival={festival} />;
}
