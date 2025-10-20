export default function PostSkeleton() {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>

          <div className="mt-2 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
          </div>

          <div className="mt-3 h-48 bg-gray-300 rounded-xl animate-pulse"></div>

          <div className="flex items-center justify-between mt-4 max-w-md">
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}