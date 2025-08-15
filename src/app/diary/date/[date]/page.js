import { mockDiaries } from '../../mockData';
import DiaryList from '../../_components/DiaryList';

export function generateStaticParams() {
  const uniqueDates = [...new Set(mockDiaries.map((d) => d.date))];

  return uniqueDates.map((date) => ({
    date,
  }));
}

export default async function Page({ params }) {
  const { date } = await params;
  const diariesForDate = mockDiaries.filter((d) => d.date === date);

  if (diariesForDate.length === 0) return <p>해당 날짜의 일기가 없습니다.</p>;

  return <DiaryList date={date} diaries={diariesForDate} />;
}
