import { Card } from "@/components/ui/card";
import { TeamMemberWithSchedules, OverlapPeriod } from "@shared/schema";
import MemberRow from "./member-row";
import OverlapIndicator from "./overlap-indicator";

interface TimelineProps {
  members: TeamMemberWithSchedules[];
  overlaps: OverlapPeriod[];
  selectedDay: string;
  onContextMenu: (event: React.MouseEvent, memberId?: number) => void;
}

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export default function Timeline({ members, overlaps, selectedDay, onContextMenu }: TimelineProps) {
  return (
    <Card className="overflow-hidden">
      {/* Timeline Header */}
      <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="flex">
          <div className="w-32 flex-shrink-0 p-3 font-medium text-gray-700 border-r border-gray-200">
            <span className="text-sm">Colaborador</span>
          </div>
          <div className="flex-1 flex timeline-grid">
            {TIME_SLOTS.map((time, index) => (
              <div
                key={time}
                className="flex-1 p-3 text-center border-r border-gray-200 text-xs font-mono text-gray-600 last:border-r-0"
              >
                {time}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Members Schedule */}
      <div className="divide-y divide-gray-200">
        {members.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            selectedDay={selectedDay}
            onContextMenu={onContextMenu}
          />
        ))}

        {/* Overlap Indicator */}
        {overlaps.length > 0 && (
          <OverlapIndicator overlaps={overlaps} />
        )}
      </div>
    </Card>
  );
}
