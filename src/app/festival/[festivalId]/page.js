import { mockFestivals } from '../mockData';
import FestivalDetail from './FestivalDetail';

export function generateStaticParams() {
  return mockFestivals.map((festival) => ({
    festivalId: festival.id.toString(),
  }));
}

export default function Page({ params }) {
  const festivalId = Number(params.festivalId);
  const festival = mockFestivals.find((f) => f.id === festivalId);

  if (!festival) return <div>존재하지 않는 축제입니다.</div>;

  return <FestivalDetail festival={festival} />;
}
