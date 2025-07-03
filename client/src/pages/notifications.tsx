import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Trash2, 
  MoreVertical,
  Filter,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Notifications() {
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('PUT', `/api/notifications/${id}`, { isRead: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notificação marcada como lida",
      });
    },
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('PUT', `/api/notifications/${id}`, { isRead: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notificação marcada como não lida",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Notificação removida",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PUT', '/api/notifications/mark-all-read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      toast({
        title: "Todas as notificações foram marcadas como lidas",
      });
    },
  });

  const filteredNotifications = notifications.filter((notification: any) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    if (filter === "meeting") return notification.type === "meeting_reminder";
    if (filter === "schedule") return notification.type === "schedule_change";
    return true;
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'meeting_reminder':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'schedule_change':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting_reminder':
        return 'Lembrete de Reunião';
      case 'schedule_change':
        return 'Alteração de Cronograma';
      default:
        return 'Notificação';
    }
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando notificações...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="text-2xl text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Todas as notificações estão em dia'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Não Lidas</SelectItem>
                <SelectItem value="read">Lidas</SelectItem>
                <SelectItem value="meeting">Reuniões</SelectItem>
                <SelectItem value="schedule">Cronograma</SelectItem>
              </SelectContent>
            </Select>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={markAllAsReadMutation.isPending}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar Todas como Lidas
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === "all" ? "Nenhuma notificação" : `Nenhuma notificação ${filter === "unread" ? "não lida" : filter}`}
                  </h3>
                  <p className="text-gray-500">
                    {filter === "all" 
                      ? "Quando houver atualizações importantes, elas aparecerão aqui."
                      : "Tente alterar o filtro para ver outras notificações."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification: any) => (
              <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="bg-blue-500 text-white text-xs">Nova</Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            {formatDate(notification.targetDate, notification.targetTime)}
                          </span>
                          <span>•</span>
                          <span>
                            Criado em {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {notification.isRead ? (
                          <DropdownMenuItem
                            onClick={() => markAsUnreadMutation.mutate(notification.id)}
                          >
                            <EyeOff className="w-4 h-4 mr-2" />
                            Marcar como não lida
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Marcar como lida
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => deleteNotificationMutation.mutate(notification.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Sample notifications for demo */}
        {filteredNotifications.length === 0 && filter === "all" && (
          <Card>
            <CardHeader>
              <CardTitle>Notificações de Exemplo</CardTitle>
              <CardDescription>
                Estas são as notificações que aparecerão quando o sistema estiver ativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Lembrete de Daily Standup</h4>
                    <p className="text-sm text-gray-600">Sua reunião diária começará em 15 minutos às 09:00</p>
                    <span className="text-xs text-gray-500">Segunda-feira, 09:00</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start space-x-4">
                  <Clock className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Alteração de Cronograma</h4>
                    <p className="text-sm text-gray-600">Marcos atualizou seu horário de trabalho para esta semana</p>
                    <span className="text-xs text-gray-500">Hoje, 14:30</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start space-x-4">
                  <Calendar className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Sprint Review Agendada</h4>
                    <p className="text-sm text-gray-600">Nova reunião de revisão foi criada para sexta-feira às 15:00</p>
                    <span className="text-xs text-gray-500">Sexta-feira, 15:00</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}