import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScheduleBlock as ScheduleBlockType, TeamMember } from "@shared/schema";
import { timeToPercentage, snapToTimeSlot, percentageToTime } from "@/lib/schedule-utils";
import { useDragResize } from "@/lib/drag-utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScheduleBlockProps {
  schedule: ScheduleBlockType;
  member: TeamMember;
}

export default function ScheduleBlock({ schedule, member }: ScheduleBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: { startTime: string; endTime: string }) => {
      return apiRequest('PUT', `/api/schedule-blocks/${schedule.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Horário atualizado",
        description: "O horário foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o horário.",
        variant: "destructive",
      });
    },
  });

  const { onMouseDown } = useDragResize({
    element: blockRef.current,
    onDragStart: () => setIsDragging(true),
    onDragEnd: (newPosition) => {
      setIsDragging(false);
      const startTime = percentageToTime(newPosition.left);
      const endTime = percentageToTime(newPosition.left + newPosition.width);
      
      updateMutation.mutate({
        startTime: snapToTimeSlot(startTime),
        endTime: snapToTimeSlot(endTime),
      });
    },
  });

  const startPercentage = timeToPercentage(schedule.startTime);
  const endPercentage = timeToPercentage(schedule.endTime);
  const width = endPercentage - startPercentage;

  const isLunchBreak = schedule.type === 'lunch';
  const colorClass = isLunchBreak ? 'bg-red-100 border-red-300' : `team-color-${member.color}`;

  return (
    <div
      ref={blockRef}
      className={`absolute schedule-block ${colorClass} h-6 ${isDragging ? 'z-10 shadow-lg' : ''}`}
      style={{
        left: `${startPercentage}%`,
        width: `${width}%`,
      }}
      onMouseDown={onMouseDown}
    >
      {/* Left resize handle */}
      <div className={`resize-handle resize-handle-left bg-${member.color}-500`} />
      
      {/* Right resize handle */}
      <div className={`resize-handle resize-handle-right bg-${member.color}-500`} />
      
      {/* Content */}
      <div className="px-2 py-1 text-xs font-medium drag-none">
        {isLunchBreak ? (
          'Almoço'
        ) : (
          <>
            <span>{schedule.startTime}</span> - <span>{schedule.endTime}</span>
          </>
        )}
      </div>
    </div>
  );
}
