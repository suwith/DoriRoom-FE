'use client';

import { useParams } from 'next/navigation';
import useDailyDiaries from '@/hooks/diary/useDailyDiaries';
import LoadingContent from '@/app/_components/LoadingContent';
import ErrorContent from '@/app/_components/ErrorContent';
import DiaryList from '@/app/diary/_components/DiaryList';

export default function Page() {
  const params = useParams();
  const raw = params?.date;
  const asString = Array.isArray(raw) ? raw.join('-') : String(raw || '');

  const userId = params?.userId;

  const { diaries, loading, error } = useDailyDiaries(userId, asString);

  if (loading) return <LoadingContent loading={loading} />;
  if (error)
    return <ErrorContent error="일기를 불러오는 중 오류가 발생했어요." />;

  return <DiaryList date={asString} diaries={diaries} type="neighbor" />;
}
