import { mockDiaries } from '../../mockData';
import DiaryList from '../../_components/DiaryList';

export default function Page({ params }) {
  const raw = params?.date;
  const asString = Array.isArray(raw) ? raw.join('.') : String(raw || '');

  // 하이픈으로 들어와도 내부 데이터 포맷(yyyy.MM.dd)과 맞춤
  const date = asString.replace(/-/g, '.');

  const diariesForDate = mockDiaries.filter((d) => d.date === date);

  return <DiaryList date={date} diaries={diariesForDate} />;
}
