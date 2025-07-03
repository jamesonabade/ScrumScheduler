import { OverlapPeriod } from "@shared/schema";
import { timeToPercentage } from "@/lib/schedule-utils";

interface OverlapIndicatorProps {
  overlaps: OverlapPeriod[];
}

export default function OverlapIndicator({ overlaps }: OverlapIndicatorProps) {
  return (
    <div className="flex bg-orange-50 border-t-2 border-orange-200">
      <div className="w-32 flex-shrink-0 p-4 border-r border-gray-200 flex items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 overlap-color rounded-full" />
          <span className="text-sm font-semibold text-orange-800">
            Coincidências
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-2 relative">
        <div className="relative h-8 flex items-center">
          {overlaps.map((overlap, index) => {
            const startPercentage = timeToPercentage(overlap.startTime);
            const endPercentage = timeToPercentage(overlap.endTime);
            const width = endPercentage - startPercentage;

            return (
              <div
                key={index}
                className="absolute overlap-color border-2 rounded-md h-6 flex items-center justify-center"
                style={{
                  left: `${startPercentage}%`,
                  width: `${width}%`,
                }}
              >
                <div className="px-2 py-1 text-xs font-semibold">
                  {overlap.startTime}-{overlap.endTime} ({overlap.count} membros)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
