import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Timeline from "@/components/schedule/timeline";
import MeetingSuggestions from "@/components/schedule/meeting-suggestions";
import AddMemberDialog from "@/components/schedule/add-member-dialog";
import ContextMenu from "@/components/schedule/context-menu";
import { useSchedule } from "@/hooks/use-schedule";

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Segunda-feira' },
  { value: 'tuesday', label: 'Terça-feira' },
  { value: 'wednesday', label: 'Quarta-feira' },
  { value: 'thursday', label: 'Quinta-feira' },
  { value: 'friday', label: 'Sexta-feira' },
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    memberId?: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['/api/schedule', selectedDay],
  });

  const { generateMeetingSuggestions, calculateOverlaps } = useSchedule();

  const handleContextMenu = (event: React.MouseEvent, memberId?: number) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      memberId,
      visible: true,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const exportSchedule = () => {
    // TODO: Implement export functionality
    console.log('Export schedule for', selectedDay);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando cronograma...</div>
      </div>
    );
  }

  const members = scheduleData?.members || [];
  const meetings = scheduleData?.meetings || [];
  const overlaps = calculateOverlaps(members, selectedDay);
  const suggestions = generateMeetingSuggestions(members, selectedDay);

  return (
    <div className="min-h-screen bg-gray-50" onClick={closeContextMenu}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Calendar className="text-2xl text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">
                Scrum Team Schedule Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowAddMemberDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Membro
              </Button>
              <Button variant="outline" onClick={exportSchedule}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Control Panel */}
        <Card className="mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Dia da Semana:
              </label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 overlap-color rounded border-2" />
                <span className="text-sm text-gray-600">Horários Coincidentes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-300 border-dashed rounded" />
                <span className="text-sm text-gray-600">Sem Dados</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Timeline
          members={members}
          overlaps={overlaps}
          selectedDay={selectedDay}
          onContextMenu={handleContextMenu}
        />

        {/* Meeting Suggestions */}
        <MeetingSuggestions
          suggestions={suggestions}
          className="mt-6"
        />
      </main>

      {/* Dialogs and Menus */}
      <AddMemberDialog
        open={showAddMemberDialog}
        onOpenChange={setShowAddMemberDialog}
      />

      <ContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        memberId={contextMenu.memberId}
        onClose={closeContextMenu}
      />
    </div>
  );
}
