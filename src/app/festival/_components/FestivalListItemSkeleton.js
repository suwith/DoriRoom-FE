export default function FestivalListItemSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-2 animate-pulse">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200" />
      <div className="flex flex-col justify-between flex-1 pr-1">
        <div>
          <div className="flex flex-wrap gap-1 mb-1">
            <span className="bg-neutral-200 rounded-sm h-[18px] w-10" />
            <span className="bg-neutral-200 rounded-sm h-[18px] w-12" />
            <span className="bg-neutral-200 rounded-sm h-[18px] w-14" />
          </div>
          <div className="mt-1.5 h-4 bg-neutral-200 rounded w-3/4" />
          <div className="mt-1 h-3 bg-neutral-200 rounded w-2/3" />
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className="h-3 bg-neutral-200 rounded w-24" />
          <div className="flex gap-3">
            <div className="h-3 bg-neutral-200 rounded w-10" />
            <div className="h-3 bg-neutral-200 rounded w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
