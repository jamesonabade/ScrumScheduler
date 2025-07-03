import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Settings as SettingsIcon, 
  Calendar, 
  Bell, 
  Users, 
  Clock, 
  Mail,
  Save,
  TestTube,
  Key,
  Globe,
  Database
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const settingsSchema = z.object({
  google_calendar_enabled: z.boolean(),
  google_client_id: z.string().optional(),
  google_client_secret: z.string().optional(),
  notification_enabled: z.boolean(),
  smtp_host: z.string().optional(),
  smtp_port: z.string().optional(),
  smtp_user: z.string().optional(),
  smtp_password: z.string().optional(),
  default_meeting_duration: z.string(),
  work_hours_start: z.string(),
  work_hours_end: z.string(),
  company_name: z.string(),
  company_timezone: z.string(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/settings'],
  });

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      google_calendar_enabled: false,
      notification_enabled: true,
      default_meeting_duration: "30",
      work_hours_start: "07:00",
      work_hours_end: "19:00",
      company_name: "Scrum Team",
      company_timezone: "America/Sao_Paulo",
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      return apiRequest('POST', '/api/settings/bulk', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar as configurações.",
        variant: "destructive",
      });
    },
  });

  const testGoogleConnectionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/google/test-connection');
    },
    onSuccess: () => {
      toast({
        title: "Conexão testada",
        description: "Google Calendar conectado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro de conexão",
        description: "Falha ao conectar com Google Calendar. Verifique as credenciais.",
        variant: "destructive",
      });
    },
  });

  const testEmailMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/notifications/test-email');
    },
    onSuccess: () => {
      toast({
        title: "Email de teste enviado",
        description: "Verifique sua caixa de entrada.",
      });
    },
    onError: () => {
      toast({
        title: "Erro no envio",
        description: "Falha ao enviar email de teste. Verifique as configurações SMTP.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando configurações...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <SettingsIcon className="text-2xl text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gerencie as configurações do sistema de cronograma</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="calendar">Google Calendar</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="advanced">Avançado</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Configurações Gerais
                    </CardTitle>
                    <CardDescription>
                      Configurações básicas do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa/Equipe</FormLabel>
                          <FormControl>
                            <Input placeholder="Scrum Team" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuso Horário</FormLabel>
                          <FormControl>
                            <Input placeholder="America/Sao_Paulo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="work_hours_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início do Expediente</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="work_hours_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fim do Expediente</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="default_meeting_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração Padrão das Reuniões (minutos)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="30" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Google Calendar Settings */}
              <TabsContent value="calendar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Integração Google Calendar
                    </CardTitle>
                    <CardDescription>
                      Configure a sincronização com Google Calendar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="google_calendar_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Ativar Google Calendar
                            </FormLabel>
                            <FormDescription className="text-sm text-gray-500">
                              Sincronizar reuniões automaticamente com Google Calendar
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("google_calendar_enabled") && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-blue-600" />
                          <Label className="text-blue-800 font-medium">Credenciais da API</Label>
                        </div>

                        <FormField
                          control={form.control}
                          name="google_client_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client ID</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite o Client ID do Google"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="google_client_secret"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client Secret</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite o Client Secret do Google"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => testGoogleConnectionMutation.mutate()}
                          disabled={testGoogleConnectionMutation.isPending}
                          className="w-full"
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          {testGoogleConnectionMutation.isPending ? 'Testando...' : 'Testar Conexão'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Configurações de Notificações
                    </CardTitle>
                    <CardDescription>
                      Configure como e quando enviar notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="notification_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Ativar Notificações
                            </FormLabel>
                            <FormDescription className="text-sm text-gray-500">
                              Enviar notificações por email sobre reuniões e alterações
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("notification_enabled") && (
                      <div className="space-y-4 p-4 bg-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-orange-600" />
                          <Label className="text-orange-800 font-medium">Configurações SMTP</Label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="smtp_host"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Servidor SMTP</FormLabel>
                                <FormControl>
                                  <Input placeholder="smtp.gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="smtp_port"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Porta SMTP</FormLabel>
                                <FormControl>
                                  <Input placeholder="587" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="smtp_user"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Usuário SMTP</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="seu-email@gmail.com"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="smtp_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha SMTP</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Digite a senha ou app password"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => testEmailMutation.mutate()}
                          disabled={testEmailMutation.isPending}
                          className="w-full"
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          {testEmailMutation.isPending ? 'Enviando...' : 'Enviar Email de Teste'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Database className="w-5 h-5 mr-2" />
                      Configurações Avançadas
                    </CardTitle>
                    <CardDescription>
                      Configurações técnicas e de sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Status do Sistema</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Banco de Dados:</span>
                          <span className="text-green-600 font-medium">PostgreSQL Conectado</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ambiente:</span>
                          <span className="text-blue-600 font-medium">Desenvolvimento</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Versão do Sistema:</span>
                          <span className="text-gray-600 font-medium">1.0.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium mb-2 text-yellow-800">⚠️ Aviso</h4>
                      <p className="text-sm text-yellow-700">
                        Alterações nas configurações avançadas podem afetar o funcionamento do sistema. 
                        Certifique-se de ter backups antes de fazer alterações.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  className="min-w-32"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateSettingsMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}