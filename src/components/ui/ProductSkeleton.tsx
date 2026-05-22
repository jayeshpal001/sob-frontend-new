// src/components/ui/ProductSkeleton.tsx
export const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] w-full bg-gray-200"></div>
      
      {/* Typography Skeleton */}
      <div className="flex flex-col space-y-2 mt-2">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 w-1/2"></div>
          <div className="h-5 bg-gray-200 w-1/5"></div>
        </div>
        <div className="h-3 bg-gray-200 w-3/4"></div>
      </div>
    </div>
  );
};