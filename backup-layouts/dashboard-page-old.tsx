'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  Dog,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Syringe,
  Hotel,
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Plus,
  ArrowRight,
  Sparkles,
  Heart,
  Cat,
  PawPrint,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary"></div>
          <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Tutores',
      value: dashboard?.totalTutors || 0,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: '/dashboard/tutores',
    },
    {
      title: 'Pets Ativos',
      value: dashboard?.totalPets || 0,
      icon: Dog,
      gradient: 'from-green-500 to-emerald-600',
      bgLight: 'bg-green-50',
      iconColor: 'text-green-600',
      href: '/dashboard/pets',
    },
    {
      title: 'Agendamentos Hoje',
      value: dashboard?.todayAppointments || 0,
      icon: Calendar,
      gradient: 'from-purple-500 to-violet-600',
      bgLight: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: '/dashboard/agenda',
    },
    {
      title: 'Receita do Mes',
      value: formatCurrency(dashboard?.monthRevenue || 0),
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trend: dashboard?.revenueGrowth,
      href: '/dashboard/financeiro',
    },
    {
      title: 'Vacinas Pendentes',
      value: dashboard?.pendingVaccines || 0,
      icon: Syringe,
      gradient: 'from-orange-500 to-amber-600',
      bgLight: 'bg-orange-50',
      iconColor: 'text-orange-600',
      href: '/dashboard/vacinas',
    },
    {
      title: 'Hospedagem Ativa',
      value: dashboard?.activeBoarding || 0,
      icon: Hotel,
      gradient: 'from-pink-500 to-rose-600',
      bgLight: 'bg-pink-50',
      iconColor: 'text-pink-600',
      href: '/dashboard/hospedagem',
    },
  ];

  const quickActions = [
    {
      title: 'Novo Agendamento',
      icon: Calendar,
      href: '/dashboard/agenda?action=new',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Agende consultas e servicos',
    },
    {
      title: 'Cadastrar Tutor',
      icon: Users,
      href: '/dashboard/tutores?action=new',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Adicione novos clientes',
    },
    {
      title: 'Cadastrar Pet',
      icon: Dog,
      href: '/dashboard/pets?action=new',
      gradient: 'from-purple-500 to-violet-600',
      description: 'Registre um novo pet',
    },
    {
      title: 'Nova Venda',
      icon: ShoppingCart,
      href: '/dashboard/vendas?action=new',
      gradient: 'from-orange-500 to-amber-600',
      description: 'Registre uma venda',
    },
  ];

  const features = [
    { icon: Syringe, label: 'Vacinas', href: '/dashboard/vacinas' },
    { icon: Hotel, label: 'Hotel', href: '/dashboard/hospedagem' },
    { icon: Cat, label: 'Daycare', href: '/dashboard/daycare' },
    { icon: Heart, label: 'Adocao', href: '/dashboard/adocao' },
    { icon: ShoppingCart, label: 'Marketplace', href: '/dashboard/marketplace' },
    { icon: MessageCircle, label: 'WhatsApp', href: '/dashboard/whatsapp' },
    { icon: BarChart3, label: 'Relatorios', href: '/dashboard/relatorios' },
    { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header com Boas-vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-8 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <PawPrint className="h-64 w-64 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="text-blue-100 text-sm font-medium">Pet360 Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
          <p className="text-blue-100 max-w-xl">
            Gerencie seu negocio pet de forma completa. Acompanhe tutores, pets, agendamentos,
            vendas e muito mais em um so lugar.
          </p>
        </div>
        <div className="absolute bottom-0 right-8 hidden lg:block">
          <div className="flex items-end gap-2 opacity-90">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Dog className="h-12 w-12 text-white" />
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 -mb-2">
              <Cat className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Visao Geral</h2>
          <Link href="/dashboard/relatorios" className="text-sm text-primary hover:underline flex items-center gap-1">
            Ver relatorios <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="group relative overflow-hidden hover:shadow-card-hover transition-all duration-300 border-0 shadow-card cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  {stat.trend !== undefined && (
                    <p className={`text-sm flex items-center gap-1 mt-1 ${
                      parseFloat(stat.trend) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(stat.trend) >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-medium">{stat.trend}%</span>
                      <span className="text-gray-500">vs mes anterior</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Acoes Rapidas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acoes Rapidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="group relative overflow-hidden hover:shadow-card-hover transition-all duration-300 border-0 shadow-card cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </CardContent>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Grid de Recursos e Lembretes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recursos */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recursos do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {features.map((feature) => (
                <Link
                  key={feature.label}
                  href={feature.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-primary transition-colors group"
                >
                  <feature.icon className="h-6 w-6 text-gray-500 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-medium text-center">{feature.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lembretes */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Lembretes Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.pendingVaccines > 0 && (
              <Link href="/dashboard/vacinas">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-colors cursor-pointer group">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Syringe className="h-6 w-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Vacinas Proximas</p>
                    <p className="text-sm text-gray-600">
                      {dashboard.pendingVaccines} pets com vacinas nos proximos 30 dias
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )}
            {dashboard?.activeBoarding > 0 && (
              <Link href="/dashboard/hospedagem">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl hover:from-pink-100 hover:to-rose-100 transition-colors cursor-pointer group">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Hotel className="h-6 w-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Hospedagem Ativa</p>
                    <p className="text-sm text-gray-600">
                      {dashboard.activeBoarding} pets hospedados atualmente
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            )}
            {!dashboard?.pendingVaccines && !dashboard?.activeBoarding && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-4 bg-green-50 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-green-500" />
                </div>
                <p className="font-medium text-gray-900">Tudo em dia!</p>
                <p className="text-sm text-gray-500">
                  Nenhum lembrete pendente no momento
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Banner Pet Sitters */}
      <Card className="relative overflow-hidden border-0 shadow-card bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 text-white">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">Novo</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Marketplace & Pet Sitters</h3>
              <p className="text-purple-100 mb-4">
                Conecte-se com pet sitters qualificados e explore produtos para seus clientes no nosso marketplace integrado.
              </p>
              <div className="flex gap-3">
                <Link href="/dashboard/pet-sitters">
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Ver Pet Sitters
                  </Button>
                </Link>
                <Link href="/dashboard/marketplace">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Explorar Marketplace
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <PawPrint className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
        <div className="absolute -bottom-4 -right-4 opacity-10">
          <PawPrint className="h-48 w-48" />
        </div>
      </Card>
    </div>
  );
}
