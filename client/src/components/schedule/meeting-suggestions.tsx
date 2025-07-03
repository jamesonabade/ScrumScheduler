import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Clock, CalendarPlus } from "lucide-react";
import { MeetingSuggestion } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface MeetingSuggestionsProps {
  suggestions: MeetingSuggestion[];
  className?: string;
}

const MEETING_COLORS = {
  daily: 'bg-blue-50 border-blue-200 text-blue-900',
  review: 'bg-green-50 border-green-200 text-green-900',
  planning: 'bg-purple-50 border-purple-200 text-purple-900',
};

const MEETING_LABELS = {
  daily: 'Daily',
  review: 'Review/Retro',
  planning: 'Planning',
};

export default function MeetingSuggestions({ suggestions, className }: MeetingSuggestionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMeetingMutation = useMutation({
    mutationFn: async (suggestion: MeetingSuggestion) => {
      return apiRequest('POST', '/api/meetings', {
        type: suggestion.type,
        dayOfWeek: suggestion.dayOfWeek,
        startTime: suggestion.startTime,
        endTime: suggestion.endTime,
        participants: suggestion.participants,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Reunião agendada",
        description: "A reunião foi adicionada ao cronograma.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao agendar a reunião.",
        variant: "destructive",
      });
    },
  });

  const handleScheduleMeeting = (suggestion: MeetingSuggestion) => {
    createMeetingMutation.mutate(suggestion);
  };

  const exportToGoogleCalendar = (suggestion: MeetingSuggestion) => {
    // Create Google Calendar event URL
    const startDate = new Date();
    startDate.setHours(parseInt(suggestion.startTime.split(':')[0]));
    startDate.setMinutes(parseInt(suggestion.startTime.split(':')[1]));
    
    const endDate = new Date();
    endDate.setHours(parseInt(suggestion.endTime.split(':')[0]));
    endDate.setMinutes(parseInt(suggestion.endTime.split(':')[1]));
    
    const title = `${MEETING_LABELS[suggestion.type]} - Scrum Team`;
    const details = `Participantes: ${suggestion.participants.join(', ')}`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').slice(0, -5)}Z/${endDate.toISOString().replace(/[-:]/g, '').slice(0, -5)}Z&details=${encodeURIComponent(details)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="text-yellow-500 mr-2 h-5 w-5" />
        Sugestões de Reuniões
      </h3>
      
      {suggestions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Não há horários disponíveis para reuniões no dia selecionado.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => {
            const colorClass = MEETING_COLORS[suggestion.type];
            const textColorClass = colorClass.split(' ')[2]; // Extract text color
            
            return (
              <div
                key={index}
                className={`${colorClass} border rounded-lg p-4`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    {MEETING_LABELS[suggestion.type]}
                  </h4>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 hover:bg-white/50 ${textColorClass}`}
                      onClick={() => handleScheduleMeeting(suggestion)}
                      disabled={createMeetingMutation.isPending}
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className={`text-sm mb-2 flex items-center`}>
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{suggestion.startTime} - {suggestion.endTime}</span>
                </p>
                
                <p className="text-xs mb-2">
                  {suggestion.participants.length} membros disponíveis
                </p>
                
                <div className="text-xs">
                  {suggestion.participants.join(', ')}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full text-xs"
                  onClick={() => exportToGoogleCalendar(suggestion)}
                >
                  Exportar para Google Calendar
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
