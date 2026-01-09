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
  Hotel
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-600">Metricas e estatisticas do negocio</p>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600">Metricas e estatisticas do negocio</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tutores</p>
                <p className="text-2xl font-bold">{totalTutors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Dog className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pets</p>
                <p className="text-2xl font-bold">{totalPets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agendamentos</p>
                <p className="text-2xl font-bold">{totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendas</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-green-600">
              {formatCurrency(Number(totalRevenue))}
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Total acumulado</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Servicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="h-4 w-4 text-gray-600" />
                </div>
                <span>Produtos Cadastrados</span>
              </div>
              <span className="font-bold">{totalProducts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Syringe className="h-4 w-4 text-gray-600" />
                </div>
                <span>Vacinas Aplicadas</span>
              </div>
              <span className="font-bold">{totalVaccines}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Hotel className="h-4 w-4 text-gray-600" />
                </div>
                <span>Hospedagens</span>
              </div>
              <span className="font-bold">{totalBoardings}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Periodo Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <span>Agendamentos esta semana</span>
              </div>
              <span className="font-bold text-blue-600">{appointmentsThisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </div>
                <span>Vendas este mes</span>
              </div>
              <span className="font-bold text-green-600">{salesThisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <span>Novos tutores este mes</span>
              </div>
              <span className="font-bold text-purple-600">{newTutorsThisMonth}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Syringe className="h-4 w-4 text-orange-600" />
                </div>
                <span>Vacinas pendentes</span>
              </div>
              <span className="font-bold text-orange-600">{vaccinesDue}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">Dashboard de Analytics</p>
              <p className="text-sm text-blue-700">
                Graficos detalhados e relatorios avancados estarao disponiveis em breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
