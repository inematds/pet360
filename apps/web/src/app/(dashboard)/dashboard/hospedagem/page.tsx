'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  Plus,
  Hotel,
  Calendar,
  Dog,
  CheckCircle,
  XCircle,
  X,
  PawPrint,
  DoorOpen,
  DoorClosed,
  Clock,
  Users,
  Bed,
} from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; gradient: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', gradient: 'from-amber-400 to-orange-500' },
  CONFIRMED: { bg: 'bg-blue-50', text: 'text-blue-700', gradient: 'from-blue-400 to-indigo-500' },
  CHECKED_IN: { bg: 'bg-green-50', text: 'text-green-700', gradient: 'from-green-400 to-emerald-500' },
  CHECKED_OUT: { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-400 to-slate-500' },
  CANCELLED: { bg: 'bg-red-50', text: 'text-red-700', gradient: 'from-red-400 to-rose-500' },
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  CHECKED_IN: 'Hospedado',
  CHECKED_OUT: 'Finalizado',
  CANCELLED: 'Cancelado',
};

export default function HospedagemPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    specialInstructions: '',
    feedingInstructions: '',
    medicationInstructions: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reservationsResponse, isLoading } = useQuery({
    queryKey: ['boarding-reservations'],
    queryFn: async () => {
      const response = await api.get('/boarding/reservations');
      return response.data;
    },
  });

  const reservations = reservationsResponse?.data || [];

  const { data: roomsResponse } = useQuery({
    queryKey: ['boarding-rooms'],
    queryFn: async () => {
      const response = await api.get('/boarding/rooms');
      return response.data;
    },
  });

  const rooms = roomsResponse?.data || [];

  const { data: petsResponse } = useQuery({
    queryKey: ['pets-select'],
    queryFn: async () => {
      const response = await api.get('/pets');
      return response.data;
    },
  });

  const pets = petsResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/boarding/reservations', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boarding-reservations'] });
      toast({ title: 'Reserva criada com sucesso!' });
      setShowForm(false);
      setFormData({ petId: '', roomId: '', checkInDate: '', checkOutDate: '', specialInstructions: '', feedingInstructions: '', medicationInstructions: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar reserva',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const checkInMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/boarding/reservations/${id}/checkin`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boarding-reservations'] });
      toast({ title: 'Check-in realizado!' });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/boarding/reservations/${id}/checkout`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boarding-reservations'] });
      toast({ title: 'Check-out realizado!' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const stats = [
    {
      label: 'Quartos',
      value: rooms?.length || 0,
      icon: Bed,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      label: 'Hospedados',
      value: reservations?.filter((r: any) => r.status === 'CHECKED_IN').length || 0,
      icon: Dog,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Confirmados',
      value: reservations?.filter((r: any) => r.status === 'CONFIRMED').length || 0,
      icon: CheckCircle,
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      label: 'Pendentes',
      value: reservations?.filter((r: any) => r.status === 'PENDING').length || 0,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Hotel className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="absolute left-0 bottom-0 opacity-10">
          <Dog className="h-32 w-32 translate-y-4 -translate-x-4" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Hotel className="h-5 w-5" />
              <span className="text-pink-100 text-sm font-medium">Hotel Pet</span>
            </div>
            <h1 className="text-2xl font-bold">Hospedagem</h1>
            <p className="text-pink-100 text-sm mt-1">
              Gerenciar reservas e quartos
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-pink-600 hover:bg-pink-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Reserva
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario de Nova Reserva */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-xl">
                  <Hotel className="h-5 w-5 text-pink-600" />
                </div>
                <CardTitle>Nova Reserva</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pet *</label>
                <select
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Selecione um pet</option>
                  {pets?.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>{pet.name} - {pet.tutor?.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Quarto *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                >
                  <option value="">Selecione um quarto</option>
                  {rooms?.map((room: any) => (
                    <option key={room.id} value={room.id}>{room.name} - {formatCurrency(Number(room.pricePerDay))}/dia</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Check-in *</label>
                <Input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Check-out *</label>
                <Input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Instrucoes Especiais</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Alergias, medicamentos, comportamento, preferencias..."
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Criar Reserva'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Reservas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-pink-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando reservas...</p>
        </div>
      ) : reservations?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-pink-50 rounded-full w-fit mx-auto mb-4">
              <Hotel className="h-10 w-10 text-pink-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-gray-500 mb-4">
              Comece criando a primeira reserva
            </p>
            <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-pink-500 to-rose-600">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reserva
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservations?.map((reservation: any) => {
            const status = statusConfig[reservation.status] || statusConfig.PENDING;

            return (
              <Card key={reservation.id} className="border-0 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
                {/* Header do Card */}
                <div className={`bg-gradient-to-r ${status.gradient} p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Dog className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{reservation.pet?.name}</h3>
                        <p className="text-white/80 text-sm">{reservation.tutor?.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white`}>
                      {statusLabels[reservation.status]}
                    </span>
                  </div>
                </div>

                {/* Conteudo */}
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Quarto:</span>
                      <span className="font-medium text-gray-900">{reservation.room?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <DoorOpen className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">{formatDate(reservation.checkInDate)}</span>
                      </div>
                      <span className="text-gray-300">→</span>
                      <div className="flex items-center gap-2 text-sm">
                        <DoorClosed className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600">{formatDate(reservation.checkOutDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acoes */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                    {reservation.status === 'CONFIRMED' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() => checkInMutation.mutate(reservation.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Check-in
                      </Button>
                    )}
                    {reservation.status === 'CHECKED_IN' && (
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                        onClick={() => checkOutMutation.mutate(reservation.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Check-out
                      </Button>
                    )}
                    {(reservation.status === 'PENDING' || reservation.status === 'CHECKED_OUT' || reservation.status === 'CANCELLED') && (
                      <div className="flex-1 text-center text-sm text-gray-400 py-2">
                        {reservation.status === 'PENDING' && 'Aguardando confirmacao'}
                        {reservation.status === 'CHECKED_OUT' && 'Finalizado'}
                        {reservation.status === 'CANCELLED' && 'Cancelado'}
                      </div>
                    )}
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
