import { Skeleton } from "teachtech/components/ui/skeleton";

export const Loader = () => {
  return (
    <div className="flex gap-4">
      <div className="space-y-2">
        <Skeleton className="h-12 w-[500px]" />
        <Skeleton className="h-12 w-[500px]" />
        <Skeleton className="h-12 w-[500px]" />
      </div>
    </div>
  );
};
