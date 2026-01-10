'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart3,
  Users,
  Dog,
  Calendar,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Syringe,
  Hotel,
  PawPrint,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    },
  });

  const dashboard = dashboardResponse?.data || dashboardResponse || {};

  const { data: metricsResponse } = useQuery({
    queryKey: ['analytics-metrics'],
    queryFn: async () => {
      const response = await api.get('/analytics/metrics');
      return response.data;
    },
  });

  const metrics = metricsResponse?.data || metricsResponse || {};

  // Extract values with fallbacks
  const totalTutors = dashboard.totalTutors || dashboard.tutors || 0;
  const totalPets = dashboard.totalPets || dashboard.pets || 0;
  const totalAppointments = dashboard.totalAppointments || dashboard.appointments || 0;
  const totalSales = dashboard.totalSales || dashboard.sales || 0;
  const totalRevenue = dashboard.totalRevenue || dashboard.revenue || 0;
  const totalProducts = dashboard.totalProducts || dashboard.products || 0;
  const totalVaccines = dashboard.totalVaccines || dashboard.vaccines || 0;
  const totalBoardings = dashboard.totalBoardings || dashboard.boardings || 0;

  const appointmentsThisWeek = metrics.appointmentsThisWeek || 0;
  const salesThisMonth = metrics.salesThisMonth || 0;
  const newTutorsThisMonth = metrics.newTutorsThisMonth || 0;
  const vaccinesDue = metrics.vaccinesDue || 0;

  const overviewStats = [
    { label: 'Tutores', value: totalTutors, icon: Users, gradient: 'from-blue-500 to-indigo-600', textColor: 'text-blue-600' },
    { label: 'Pets', value: totalPets, icon: Dog, gradient: 'from-green-500 to-emerald-600', textColor: 'text-green-600' },
    { label: 'Agendamentos', value: totalAppointments, icon: Calendar, gradient: 'from-purple-500 to-violet-600', textColor: 'text-purple-600' },
    { label: 'Vendas', value: totalSales, icon: ShoppingCart, gradient: 'from-orange-500 to-amber-600', textColor: 'text-orange-600' },
  ];

  const serviceStats = [
    { label: 'Produtos Cadastrados', value: totalProducts, icon: Package },
    { label: 'Vacinas Aplicadas', value: totalVaccines, icon: Syringe },
    { label: 'Hospedagens', value: totalBoardings, icon: Hotel },
  ];

  const periodStats = [
    { label: 'Agendamentos esta semana', value: appointmentsThisWeek, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Vendas este mes', value: salesThisMonth, icon: ShoppingCart, color: 'text-green-600 bg-green-50' },
    { label: 'Novos tutores este mes', value: newTutorsThisMonth, icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Vacinas pendentes', value: vaccinesDue, icon: Syringe, color: 'text-orange-600 bg-orange-50' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 p-6 text-white">
          <div className="absolute right-0 top-0 opacity-10">
            <BarChart3 className="h-48 w-48 -translate-y-8 translate-x-8" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5" />
              <span className="text-violet-100 text-sm font-medium">Metricas e Estatisticas</span>
            </div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-violet-100 text-sm mt-1">Visao geral do seu negocio</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-violet-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando metricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <BarChart3 className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5" />
            <span className="text-violet-100 text-sm font-medium">Metricas e Estatisticas</span>
          </div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-violet-100 text-sm mt-1">Visao geral do seu negocio</p>
        </div>
      </div>

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-card overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Card */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle>Receita Total</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-600">
              {formatCurrency(Number(totalRevenue))}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Total acumulado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Stats Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Services Card */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-500" />
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <CardTitle className="text-lg">Servicos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {serviceStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <stat.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Period Stats Card */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-violet-400 to-purple-500" />
          <CardHeader className="border-b bg-gradient-to-r from-violet-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-xl">
                <Calendar className="h-5 w-5 text-violet-600" />
              </div>
              <CardTitle className="text-lg">Periodo Atual</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {periodStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.color.split(' ')[1]}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color.split(' ')[0]}`} />
                    </div>
                    <span className="text-gray-700">{stat.label}</span>
                  </div>
                  <span className={`font-bold ${stat.color.split(' ')[0]}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="border-0 shadow-card bg-gradient-to-r from-violet-50 to-purple-50 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 rounded-xl">
              <BarChart3 className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-violet-900">Dashboard de Analytics</p>
              <p className="text-sm text-violet-700">
                Graficos detalhados e relatorios avancados estarao disponiveis em breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
