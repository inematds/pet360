'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, ChevronLeft, ChevronRight, Clock, User, Dog, Check, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agenda</h1>
          <p className="text-gray-600">Gerencie os agendamentos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon" onClick={handlePrevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-center">
          <div className="font-semibold">
            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
          </div>
          <div className="text-lg">
            {selectedDate.toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
        <Button variant="outline" size="icon" onClick={handleNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
          Hoje
        </Button>
      </div>

      {/* New Appointment Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Agendamento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Tutor *</label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {tutors?.map((tutor: any) => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Servico *</label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {services?.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatCurrency(Number(service.price))}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profissional *</label>
                <select
                  value={formData.professionalId}
                  onChange={(e) => setFormData({ ...formData, professionalId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {professionals?.map((prof: any) => (
                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data *</label>
                <Input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Horario *</label>
                <Input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observacoes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Appointments List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : appointments?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum agendamento para esta data</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {appointments?.map((appointment: any) => (
            <Card key={appointment.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{appointment.scheduledTime}</div>
                      <div className="text-xs text-gray-500">
                        {appointment.duration} min
                      </div>
                    </div>
                    <div className="border-l pl-4">
                      <div className="flex items-center gap-2">
                        <Dog className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{appointment.pet?.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${statusColors[appointment.status]}`}>
                          {statusLabels[appointment.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        {appointment.tutor?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {appointment.service?.name} - {formatCurrency(Number(appointment.finalPrice))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {appointment.status === 'SCHEDULED' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
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
                          onClick={() => updateStatusMutation.mutate({
                            id: appointment.id,
                            status: 'CANCELLED',
                          })}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {appointment.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({
                          id: appointment.id,
                          status: 'IN_PROGRESS',
                        })}
                      >
                        Iniciar
                      </Button>
                    )}
                    {appointment.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatusMutation.mutate({
                          id: appointment.id,
                          status: 'COMPLETED',
                        })}
                      >
                        Finalizar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
