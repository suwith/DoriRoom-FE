'use client';

import { useRouter } from 'next/navigation';
import FestivalCard from './FestivalCard';

export default function FestivalCardSection({ title, festivals }) {
  const router = useRouter();

  return (
    <section className="mt-6 px-4">
      <h2 className="text-sm md:text-base font-semibold mb-3 text-black">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {festivals.map((festival) => (
          <div
            key={festival.id}
            onClick={() => router.push(`/festival/${festival.id}`)}
          >
            <FestivalCard festival={festival} />
          </div>
        ))}
      </div>
    </section>
  );
}
