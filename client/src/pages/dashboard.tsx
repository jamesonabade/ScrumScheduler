import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Bell, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Activity
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useSchedule } from "@/hooks/use-schedule";

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function Dashboard() {
  const { data: mondayData } = useQuery({
    queryKey: ['/api/schedule', 'monday'],
  });

  const { data: teamMembers } = useQuery({
    queryKey: ['/api/team-members'],
  });

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const { data: meetings } = useQuery({
    queryKey: ['/api/meetings'],
  });

  const { calculateOverlaps, generateMeetingSuggestions } = useSchedule();

  // Calculate weekly statistics
  const weeklyStats = DAYS_OF_WEEK.map(day => {
    const { data } = useQuery({
      queryKey: ['/api/schedule', day],
    });
    return { day, data };
  });

  const totalMembers = teamMembers?.length || 0;
  const activeMembers = mondayData?.members?.filter((m: any) => m.schedules.length > 0).length || 0;
  const totalMeetings = meetings?.length || 0;
  const unreadNotifications = notifications?.filter((n: any) => !n.isRead).length || 0;

  // Calculate overlap coverage for the week
  const weeklyOverlapCoverage = weeklyStats.reduce((acc, { data }) => {
    if (!data?.members) return acc;
    const overlaps = calculateOverlaps(data.members, data.day);
    return acc + (overlaps.length > 0 ? 1 : 0);
  }, 0);

  const overlapPercentage = (weeklyOverlapCoverage / DAYS_OF_WEEK.length) * 100;

  // Get today's suggestions
  const todayData = mondayData; // For demo, using Monday
  const todaySuggestions = todayData ? generateMeetingSuggestions(todayData.members, 'monday') : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral do cronograma da equipe Scrum</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="w-3 h-3 mr-1" />
              Sistema Ativo
            </Badge>
            {unreadNotifications > 0 && (
              <Badge variant="destructive">
                <Bell className="w-3 h-3 mr-1" />
                {unreadNotifications} Notificações
              </Badge>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {activeMembers} com cronogramas ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reuniões Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMeetings}</div>
              <p className="text-xs text-muted-foreground">
                {todaySuggestions.length} sugestões para hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cobertura de Horários</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overlapPercentage.toFixed(0)}%</div>
              <Progress value={overlapPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Sobreposição semanal de horários
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notificações</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadNotifications}</div>
              <p className="text-xs text-muted-foreground">
                Não lidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Visão Semanal
              </CardTitle>
              <CardDescription>
                Atividade da equipe por dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const dayData = weeklyStats.find(s => s.day === day)?.data;
                  const activeMembersCount = dayData?.members?.filter((m: any) => m.schedules.length > 0).length || 0;
                  const percentage = totalMembers > 0 ? (activeMembersCount / totalMembers) * 100 : 0;
                  
                  const dayNames: { [key: string]: string } = {
                    monday: 'Segunda-feira',
                    tuesday: 'Terça-feira', 
                    wednesday: 'Quarta-feira',
                    thursday: 'Quinta-feira',
                    friday: 'Sexta-feira'
                  };

                  return (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium">{dayNames[day]}</div>
                      <div className="flex-1">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <div className="w-16 text-sm text-gray-600">{activeMembersCount}/{totalMembers}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Sugestões Hoje
              </CardTitle>
              <CardDescription>
                Horários recomendados para reuniões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySuggestions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma sugestão disponível para hoje
                  </p>
                ) : (
                  todaySuggestions.map((suggestion, index) => {
                    const typeColors = {
                      daily: 'bg-blue-100 text-blue-800',
                      review: 'bg-green-100 text-green-800',
                      planning: 'bg-purple-100 text-purple-800'
                    };
                    
                    const typeLabels = {
                      daily: 'Daily',
                      review: 'Review',
                      planning: 'Planning'
                    };

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <Badge className={typeColors[suggestion.type]}>
                            {typeLabels[suggestion.type]}
                          </Badge>
                          <p className="text-sm mt-1">{suggestion.startTime} - {suggestion.endTime}</p>
                          <p className="text-xs text-gray-500">{suggestion.participants.length} participantes</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Atividade Recente
            </CardTitle>
            <CardDescription>
              Últimas atualizações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sistema inicializado com dados da equipe</p>
                  <p className="text-xs text-gray-500">7 membros da equipe carregados com cronogramas completos</p>
                </div>
                <span className="text-xs text-gray-400">Agora</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cronogramas semanais configurados</p>
                  <p className="text-xs text-gray-500">Segunda a sexta-feira com horários de trabalho e almoço</p>
                </div>
                <span className="text-xs text-gray-400">Agora</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-4 h-4 text-purple-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Reuniões Scrum agendadas</p>
                  <p className="text-xs text-gray-500">Daily, Planning e Review configuradas</p>
                </div>
                <span className="text-xs text-gray-400">Agora</span>
              </div>

              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Integração Google Calendar pendente</p>
                  <p className="text-xs text-gray-500">Configure as credenciais para ativar a sincronização</p>
                </div>
                <span className="text-xs text-gray-400">Configuração</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}