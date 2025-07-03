import { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Utensils, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  memberId?: number;
  onClose: () => void;
}

export default function ContextMenu({ visible, x, y, memberId, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createScheduleMutation = useMutation({
    mutationFn: async (data: { memberId: number; type: 'work' | 'lunch' }) => {
      const defaultTimes = data.type === 'work' 
        ? { startTime: '09:00', endTime: '17:00' }
        : { startTime: '12:00', endTime: '13:00' };
      
      return apiRequest('POST', '/api/schedule-blocks', {
        memberId: data.memberId,
        dayOfWeek: 'monday', // TODO: Get current selected day
        type: data.type,
        ...defaultTimes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      toast({
        title: "Horário adicionado",
        description: "O horário foi adicionado com sucesso.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao adicionar o horário.",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
      toast({
        title: "Membro removido",
        description: "O membro foi removido da equipe.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover o membro da equipe.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  const handleAddTimeBlock = () => {
    if (memberId) {
      createScheduleMutation.mutate({ memberId, type: 'work' });
    }
  };

  const handleAddLunchBreak = () => {
    if (memberId) {
      createScheduleMutation.mutate({ memberId, type: 'lunch' });
    }
  };

  const handleEditMember = () => {
    // TODO: Implement edit member dialog
    console.log('Edit member', memberId);
    onClose();
  };

  const handleDeleteMember = () => {
    if (memberId && window.confirm('Tem certeza que deseja remover este membro?')) {
      deleteMemberMutation.mutate(memberId);
    }
  };

  return (
    <Card
      ref={menuRef}
      className="fixed z-50 py-2 shadow-lg min-w-48"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleAddTimeBlock}
          disabled={!memberId}
        >
          <Plus className="mr-2 h-4 w-4 text-blue-500" />
          Adicionar Horário
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleAddLunchBreak}
          disabled={!memberId}
        >
          <Utensils className="mr-2 h-4 w-4 text-orange-500" />
          Adicionar Intervalo
        </Button>
        
        <hr className="my-1" />
        
        <Button
          variant="ghost"
          className="w-full justify-start text-sm"
          onClick={handleEditMember}
          disabled={!memberId}
        >
          <Edit className="mr-2 h-4 w-4 text-gray-500" />
          Editar Colaborador
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDeleteMember}
          disabled={!memberId}
        >
          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
          Remover Colaborador
        </Button>
      </div>
    </Card>
  );
}
