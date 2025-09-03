'use client';

import DiaryDetail from '../_components/DiaryDetail';
import ErrorContent from '@/app/_components/ErrorContent';
import useDiaryDetail from '@/hooks/diary/useDiaryDetail';
import LoadingModal from '@/app/_components/LoadingModal';
import { useParams } from 'next/navigation';

export default function DiaryPage() {
  const params = useParams();
  const diaryId = Array.isArray(params.diaryId)
    ? params.diaryId[0]
    : params.diaryId;

  const { diary, loading, error } = useDiaryDetail(diaryId);

  if (loading) {
    return <LoadingModal open={loading} />;
  }

  if (error) {
    return <ErrorContent error={'일기를 불러오는 중 오류가 발생했습니다.'} />;
  }

  if (!diary) {
    return <ErrorContent error={'일기를 찾을 수 없습니다.'} />;
  }

  return <DiaryDetail diary={diary} />;
}
