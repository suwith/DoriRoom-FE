// app/diary/[diaryId]/page.jsx
import { mockDiaries } from '../mockData';
import DiaryDetail from '../_components/DiaryDetail';
import ErrorContent from '@/app/_components/ErrorContent';

export default function Page({ params }) {
  const { diaryId } = params;
  const diary = mockDiaries.find((d) => d.id === Number(diaryId));

  console.log(diary);

  if (!diary) {
    return <ErrorContent error={'일기를 찾을 수 없습니다.'} />;
  }

  return <DiaryDetail diary={diary} />;
}
