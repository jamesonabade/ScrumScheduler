import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamMemberWithSchedules } from "@shared/schema";
import ScheduleBlock from "./schedule-block";

interface MemberRowProps {
  member: TeamMemberWithSchedules;
  selectedDay: string;
  onContextMenu: (event: React.MouseEvent, memberId?: number) => void;
}

export default function MemberRow({ member, selectedDay, onContextMenu }: MemberRowProps) {
  const schedules = member.schedules.filter(s => s.dayOfWeek === selectedDay);
  const hasSchedules = schedules.length > 0;

  return (
    <div 
      className="flex hover:bg-gray-50 transition-colors"
      onContextMenu={(e) => onContextMenu(e, member.id)}
    >
      <div className="w-32 flex-shrink-0 p-4 border-r border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full team-color-${member.color}`} />
          <span className="text-sm font-medium text-gray-900">
            {member.name}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit className="h-3 w-3 text-gray-400" />
        </Button>
      </div>
      
      <div className="flex-1 p-2 relative">
        <div className="relative h-8 flex items-center">
          {hasSchedules ? (
            schedules.map((schedule) => (
              <ScheduleBlock
                key={schedule.id}
                schedule={schedule}
                member={member}
              />
            ))
          ) : (
            <div
              className="absolute bg-red-50 border-2 border-red-300 border-dashed rounded-md h-6 flex items-center justify-center cursor-pointer w-full"
              onClick={(e) => onContextMenu(e, member.id)}
            >
              <span className="text-xs text-red-600 font-medium">
                <span className="mr-1">+</span>
                Clique para adicionar horário
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
