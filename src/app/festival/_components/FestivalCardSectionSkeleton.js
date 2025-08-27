import FestivalCardSkeleton from './FestivalCardSkeleton';

export default function FestivalCardSectionSkeleton({ title, count = 6 }) {
  return (
    <section className="mt-6 px-4">
      <h2 className="text-sm md:text-base font-semibold mb-3 text-black">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <FestivalCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
