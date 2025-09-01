export default function FestivalCardSkeleton() {
  return (
    <div className="bg-background overflow-hidden animate-pulse">
      <div className="relative bg-neutral-100 w-full h-40 rounded-lg" />
      <div className="py-2 text-[10px]">
        <div className="flex flex-wrap gap-1 mt-0.5">
          <span className="bg-neutral-200 rounded-sm h-[18px] w-10" />
          <span className="bg-neutral-200 rounded-sm h-[18px] w-12" />
          <span className="bg-neutral-200 rounded-sm h-[18px] w-14" />
        </div>
        <div className="mt-1.5 h-4 bg-neutral-200 rounded w-3/4" />
        <div className="mt-1 h-3 bg-neutral-200 rounded w-2/3" />
        <div className="mt-1 h-3 bg-neutral-200 rounded w-1/3" />
      </div>
    </div>
  );
}
