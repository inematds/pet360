'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Dog,
  Check,
  X,
  Calendar,
  PawPrint,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
  SCHEDULED: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Clock },
  CONFIRMED: { bg: 'bg-green-50', text: 'text-green-700', icon: Check },
  IN_PROGRESS: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Play },
  COMPLETED: { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  NO_SHOW: { bg: 'bg-orange-50', text: 'text-orange-700', icon: AlertCircle },
};

const statusLabels: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluido',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Nao Compareceu',
};

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tutorId: '',
    petId: '',
    serviceId: '',
    professionalId: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const dateStr = selectedDate.toISOString().split('T')[0];

  const { data: appointmentsResponse, isLoading } = useQuery({
    queryKey: ['appointments', dateStr],
    queryFn: async () => {
      const response = await api.get('/appointments', { params: { date: dateStr } });
      return response.data;
    },
  });

  const appointments = appointmentsResponse?.data || [];
  const totalAppointments = appointments.length;

  const { data: tutorsResponse } = useQuery({
    queryKey: ['tutors-select'],
    queryFn: async () => {
      const response = await api.get('/tutors');
      return response.data;
    },
  });

  const tutors = tutorsResponse?.data || [];

  const { data: servicesResponse } = useQuery({
    queryKey: ['services-select'],
    queryFn: async () => {
      const response = await api.get('/services');
      return response.data;
    },
  });

  const services = servicesResponse?.data || [];

  const { data: professionalsResponse } = useQuery({
    queryKey: ['users-select'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });

  const professionals = professionalsResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/appointments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Agendamento criado com sucesso!' });
      setShowForm(false);
      setFormData({
        tutorId: '',
        petId: '',
        serviceId: '',
        professionalId: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar agendamento',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put(`/appointments/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({ title: 'Status atualizado!' });
    },
  });

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      scheduledDate: new Date(formData.scheduledDate).toISOString(),
    });
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Calendar className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-5 w-5" />
              <span className="text-blue-100 text-sm font-medium">Agendamentos</span>
            </div>
            <h1 className="text-2xl font-bold">Agenda</h1>
            <p className="text-blue-100 text-sm mt-1">
              {totalAppointments} agendamentos para esta data
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Navegacao de Data */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={handlePrevDay} className="rounded-xl">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center min-w-[200px]">
              <div className="font-semibold text-gray-900 capitalize">
                {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
              </div>
              <div className="text-lg text-gray-600">
                {selectedDate.toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleNextDay} className="rounded-xl">
              <ChevronRight className="h-5 w-5" />
            </Button>
            {!isToday && (
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date())}
                className="ml-2"
              >
                Hoje
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Novo Agendamento */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle>Novo Agendamento</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tutor *</label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um tutor</option>
                  {tutors?.map((tutor: any) => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Servico *</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um servico</option>
                  {services?.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(Number(service.price))}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Profissional *</label>
                <select
                  value={formData.professionalId}
                  onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um profissional</option>
                  {professionals?.map((prof: any) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data *</label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Horario *</label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Observacoes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observacoes adicionais..."
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Agendar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Agendamentos */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando agendamentos...</p>
        </div>
      ) : appointments?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto mb-4">
              <Calendar className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhum agendamento</h3>
            <p className="text-gray-500 mb-4">
              Nao ha agendamentos para esta data
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-500 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Criar Agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments?.map((appointment: any) => {
            const status = statusConfig[appointment.status] || statusConfig.SCHEDULED;
            const StatusIcon = status.icon;

            return (
              <Card key={appointment.id} className="border-0 shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Horario */}
                      <div className="text-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-3 min-w-[70px]">
                        <div className="text-xl font-bold">{appointment.scheduledTime}</div>
                        <div className="text-xs text-blue-100">
                          {appointment.duration || 30} min
                        </div>
                      </div>

                      {/* Info */}
                      <div className="border-l pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Dog className="h-4 w-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{appointment.pet?.name}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusLabels[appointment.status]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          {appointment.tutor?.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {appointment.service?.name} - <span className="font-medium text-gray-700">{formatCurrency(Number(appointment.finalPrice))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Acoes */}
                    <div className="flex gap-2">
                      {appointment.status === 'SCHEDULED' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => updateStatusMutation.mutate({
                              id: appointment.id,
                              status: 'CONFIRMED',
                            })}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Confirmar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => updateStatusMutation.mutate({
                              id: appointment.id,
                              status: 'CANCELLED',
                            })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <Button
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600"
                          onClick={() => updateStatusMutation.mutate({
                            id: appointment.id,
                            status: 'IN_PROGRESS',
                          })}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Iniciar
                        </Button>
                      )}
                      {appointment.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => updateStatusMutation.mutate({
                            id: appointment.id,
                            status: 'COMPLETED',
                          })}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Finalizar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
