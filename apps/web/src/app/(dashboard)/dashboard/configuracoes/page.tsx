'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Settings,
  Building2,
  User,
  Bell,
  Shield,
  Palette,
  Clock,
  Save
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('business');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userResponse } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
  });

  const user = userResponse?.data || userResponse || {};

  const { data: businessResponse } = useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const response = await api.get('/businesses/current');
      return response.data;
    },
  });

  const business = businessResponse?.data || businessResponse || {};

  const [businessForm, setBusinessForm] = useState({
    name: business.name || '',
    phone: business.phone || '',
    email: business.email || '',
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    zipCode: business.zipCode || '',
  });

  const [profileForm, setProfileForm] = useState({
    name: user.name || '',
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch('/businesses/current', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-settings'] });
      toast({ title: 'Configuracoes salvas com sucesso!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.patch('/auth/profile', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      toast({ title: 'Perfil atualizado com sucesso!' });
      setProfileForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessMutation.mutate(businessForm);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      toast({ title: 'As senhas nao conferem', variant: 'destructive' });
      return;
    }
    updateProfileMutation.mutate({
      name: profileForm.name,
      ...(profileForm.newPassword && {
        currentPassword: profileForm.currentPassword,
        newPassword: profileForm.newPassword,
      }),
    });
  };

  const tabs = [
    { id: 'business', label: 'Empresa', icon: Building2 },
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificacoes', icon: Bell },
    { id: 'security', label: 'Seguranca', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-gray-600">Gerencie as configuracoes do sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Business Settings */}
      {activeTab === 'business' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>
              Informacoes do seu estabelecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Nome da Empresa</label>
                <Input
                  value={businessForm.name}
                  onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                  placeholder="Nome do Pet Shop"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <Input
                  value={businessForm.phone}
                  onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={businessForm.email}
                  onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                  placeholder="contato@petshop.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Endereco</label>
                <Input
                  value={businessForm.address}
                  onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                  placeholder="Rua, numero, bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cidade</label>
                <Input
                  value={businessForm.city}
                  onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <Input
                  value={businessForm.state}
                  onChange={(e) => setBusinessForm({ ...businessForm, state: e.target.value })}
                  maxLength={2}
                  placeholder="SP"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={updateBusinessMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateBusinessMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meu Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informacoes pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div className="md:col-span-2 border-t pt-4 mt-2">
                <h4 className="font-medium mb-3">Alterar Senha</h4>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha Atual</label>
                <Input
                  type="password"
                  value={profileForm.currentPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                />
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium mb-1">Nova Senha</label>
                <Input
                  type="password"
                  value={profileForm.newPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
                <Input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificacoes
            </CardTitle>
            <CardDescription>
              Configure suas preferencias de notificacao
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Lembretes de Agendamento</p>
                  <p className="text-sm text-gray-500">Receber lembretes de consultas e servicos</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Alertas de Vacinas</p>
                  <p className="text-sm text-gray-500">Notificacoes de vacinas proximas do vencimento</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Estoque Baixo</p>
                  <p className="text-sm text-gray-500">Alertas quando produtos estao acabando</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 rounded" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Resumo Diario</p>
                  <p className="text-sm text-gray-500">Email com resumo das atividades do dia</p>
                </div>
                <input type="checkbox" className="h-5 w-5 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguranca
            </CardTitle>
            <CardDescription>
              Configuracoes de seguranca da conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Autenticacao em Dois Fatores</p>
                  <p className="text-sm text-gray-500">Adicione uma camada extra de seguranca</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium">Sessoes Ativas</p>
                  <p className="text-sm text-gray-500">Gerencie dispositivos conectados</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Sessoes
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Historico de Login</p>
                  <p className="text-sm text-gray-500">Visualize acessos recentes a sua conta</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Historico
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Horario de Funcionamento</p>
              <p className="text-sm text-gray-600">
                Para configurar horarios de atendimento, acesse a pagina de Agenda.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
