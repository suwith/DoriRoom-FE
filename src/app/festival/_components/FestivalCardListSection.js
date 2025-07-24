'use client';

import FestivalCard from './FestivalCard';

export default function FestivalCardListSection({ title, festivals }) {
  return (
    <section className="mt-6 px-4">
      <h2 className="text-sm==md font-semibold mb-3 text-black">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {festivals.map((festival) => (
          <FestivalCard key={festival.id} festival={festival} />
        ))}
      </div>
    </section>
  );
}
