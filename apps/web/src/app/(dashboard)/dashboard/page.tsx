'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total de Tutores',
      value: dashboard?.totalTutors || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pets Ativos',
      value: dashboard?.totalPets || 0,
      icon: Dog,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Agendamentos Hoje',
      value: dashboard?.todayAppointments || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Receita do Mes',
      value: formatCurrency(dashboard?.monthRevenue || 0),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      trend: dashboard?.revenueGrowth,
    },
    {
      title: 'Vacinas Pendentes',
      value: dashboard?.pendingVaccines || 0,
      icon: Syringe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Hospedagem Ativa',
      value: dashboard?.activeBoarding || 0,
      icon: Hotel,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Visao geral do seu negocio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.trend !== undefined && (
                <p className={`text-xs flex items-center gap-1 ${
                  parseFloat(stat.trend) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {parseFloat(stat.trend) >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.trend}% vs mes anterior
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acoes Rapidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a
              href="/dashboard/agenda?action=new"
              className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Novo Agendamento</span>
            </a>
            <a
              href="/dashboard/tutores?action=new"
              className="flex items-center gap-2 p-3 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Cadastrar Tutor</span>
            </a>
            <a
              href="/dashboard/pets?action=new"
              className="flex items-center gap-2 p-3 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Dog className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Cadastrar Pet</span>
            </a>
            <a
              href="/dashboard/vendas?action=new"
              className="flex items-center gap-2 p-3 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium">Nova Venda</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lembretes</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.pendingVaccines > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg mb-2">
                <Syringe className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Vacinas Proximas</p>
                  <p className="text-xs text-gray-600">
                    {dashboard.pendingVaccines} pets com vacinas nos proximos 30 dias
                  </p>
                </div>
              </div>
            )}
            {dashboard?.activeBoarding > 0 && (
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <Hotel className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="text-sm font-medium">Hospedagem</p>
                  <p className="text-xs text-gray-600">
                    {dashboard.activeBoarding} pets hospedados atualmente
                  </p>
                </div>
              </div>
            )}
            {!dashboard?.pendingVaccines && !dashboard?.activeBoarding && (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhum lembrete no momento
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
