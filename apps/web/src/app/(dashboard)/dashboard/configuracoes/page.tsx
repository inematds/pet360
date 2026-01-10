'use client';

import { useState, useEffect } from 'react';
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
  Clock,
  Save,
  PawPrint,
  CheckCircle,
} from 'lucide-react';

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('business');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userResponse, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data;
    },
  });

  const user = userResponse?.data || userResponse || {};

  const { data: businessResponse, isLoading: loadingBusiness } = useQuery({
    queryKey: ['business-settings'],
    queryFn: async () => {
      const response = await api.get('/businesses/current');
      return response.data;
    },
  });

  const business = businessResponse?.data || businessResponse || {};

  const [businessForm, setBusinessForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Update forms when data loads
  useEffect(() => {
    if (business.name) {
      setBusinessForm({
        name: business.name || '',
        phone: business.phone || '',
        email: business.email || '',
        address: business.address || '',
        city: business.city || '',
        state: business.state || '',
        zipCode: business.zipCode || '',
      });
    }
  }, [business]);

  useEffect(() => {
    if (user.name) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

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

  const isLoading = loadingUser || loadingBusiness;

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 via-gray-600 to-slate-700 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Settings className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Settings className="h-5 w-5" />
            <span className="text-slate-200 text-sm font-medium">Preferencias do Sistema</span>
          </div>
          <h1 className="text-2xl font-bold">Configuracoes</h1>
          <p className="text-slate-200 text-sm mt-1">
            Gerencie as configuracoes do seu negocio
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-slate-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando configuracoes...</p>
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <Card className="border-0 shadow-card">
            <CardContent className="p-1">
              <div className="flex gap-1 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap flex-1 justify-center ${
                      activeTab === tab.id
                        ? 'bg-slate-100 text-slate-900 font-medium'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          {activeTab === 'business' && (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-slate-500 to-gray-600" />
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <CardDescription>Informacoes do seu estabelecimento</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleBusinessSubmit} className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome da Empresa</label>
                    <Input
                      value={businessForm.name}
                      onChange={(e) => setBusinessForm({ ...businessForm, name: e.target.value })}
                      placeholder="Nome do Pet Shop"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Telefone</label>
                    <Input
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                      placeholder="contato@petshop.com"
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Endereco</label>
                    <Input
                      value={businessForm.address}
                      onChange={(e) => setBusinessForm({ ...businessForm, address: e.target.value })}
                      placeholder="Rua, numero, bairro"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cidade</label>
                    <Input
                      value={businessForm.city}
                      onChange={(e) => setBusinessForm({ ...businessForm, city: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Estado</label>
                    <Input
                      value={businessForm.state}
                      onChange={(e) => setBusinessForm({ ...businessForm, state: e.target.value })}
                      maxLength={2}
                      placeholder="SP"
                      className="h-11"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={updateBusinessMutation.isPending}
                      className="px-6 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateBusinessMutation.isPending ? 'Salvando...' : 'Salvar Alteracoes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Meu Perfil</CardTitle>
                    <CardDescription>Atualize suas informacoes pessoais</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleProfileSubmit} className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome</label>
                    <Input
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="h-11 bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2 border-t pt-5 mt-2">
                    <h4 className="font-medium mb-4 text-gray-900">Alterar Senha</h4>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Senha Atual</label>
                        <Input
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nova Senha</label>
                        <Input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                        <Input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Perfil'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-600" />
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Notificacoes</CardTitle>
                    <CardDescription>Configure suas preferencias de notificacao</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { title: 'Lembretes de Agendamento', desc: 'Receber lembretes de consultas e servicos', defaultChecked: true },
                    { title: 'Alertas de Vacinas', desc: 'Notificacoes de vacinas proximas do vencimento', defaultChecked: true },
                    { title: 'Estoque Baixo', desc: 'Alertas quando produtos estao acabando', defaultChecked: true },
                    { title: 'Resumo Diario', desc: 'Email com resumo das atividades do dia', defaultChecked: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card className="border-0 shadow-card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle>Seguranca</CardTitle>
                    <CardDescription>Configuracoes de seguranca da conta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { title: 'Autenticacao em Dois Fatores', desc: 'Adicione uma camada extra de seguranca', action: 'Configurar' },
                    { title: 'Sessoes Ativas', desc: 'Gerencie dispositivos conectados', action: 'Ver Sessoes' },
                    { title: 'Historico de Login', desc: 'Visualize acessos recentes a sua conta', action: 'Ver Historico' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {item.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="border-0 shadow-card bg-gradient-to-r from-slate-50 to-gray-50 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <Clock className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Horario de Funcionamento</p>
                  <p className="text-sm text-slate-600">
                    Para configurar horarios de atendimento, acesse a pagina de Agenda.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
