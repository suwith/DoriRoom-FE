'use client';

import { useParams } from 'next/navigation';
import useDailyDiaries from '@/hooks/diary/useDailyDiaries';
import DiaryList from '../../_components/DiaryList';
import LoadingContent from '@/app/_components/LoadingContent';
import ErrorContent from '@/app/_components/ErrorContent';

export default function Page() {
  const params = useParams();
  const raw = params?.date;
  const asString = Array.isArray(raw) ? raw.join('-') : String(raw || '');
  const { diaries, loading, error } = useDailyDiaries(asString);

  console.log(diaries);

  if (loading) return <LoadingContent loading={loading} />;
  if (error)
    return <ErrorContent error="일기를 불러오는 중 오류가 발생했어요." />;

  return <DiaryList date={asString} diaries={diaries} />;
}
