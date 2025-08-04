import DiaryDetailPage from '../_components/DiaryDetail';
import { mockDiaries } from '../mockData';

export function generateStaticParams() {
  return mockDiaries.map((d) => ({
    diaryId: d.id.toString(),
  }));
}
export default async function Page({ params }) {
  const { diaryId } = await params;
  const diary = mockDiaries.find((d) => d.id === Number(diaryId));

  if (!diary) return <p>일기를 찾을 수 없습니다.</p>;

  return <DiaryDetailPage diary={diary} />;
}
