import Skeleton from "./Skeleton";

export default function FacilitySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white/5 border border-white/10 p-6"
        >
          <Skeleton className="h-48 mb-6 rounded-2xl" />
          <Skeleton className="h-6 w-2/3 mb-3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
