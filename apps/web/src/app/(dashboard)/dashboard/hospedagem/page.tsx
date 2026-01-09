'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Plus, Hotel, Calendar, Dog, CheckCircle, XCircle } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  CHECKED_IN: 'bg-green-100 text-green-800',
  CHECKED_OUT: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hospedagem</h1>
          <p className="text-gray-600">Gerenciar reservas de hospedagem</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Reserva
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{rooms?.length || 0}</div>
            <p className="text-sm text-gray-600">Quartos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">
              {reservations?.filter((r: any) => r.status === 'CHECKED_IN').length || 0}
            </div>
            <p className="text-sm text-gray-600">Hospedados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">
              {reservations?.filter((r: any) => r.status === 'CONFIRMED').length || 0}
            </div>
            <p className="text-sm text-gray-600">Confirmados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">
              {reservations?.filter((r: any) => r.status === 'PENDING').length || 0}
            </div>
            <p className="text-sm text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Reserva</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Pet *</label>
                <select
                  value={formData.petId}
                  onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {pets?.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>{pet.name} - {pet.tutor?.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quarto *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione</option>
                  {rooms?.map((room: any) => (
                    <option key={room.id} value={room.id}>{room.name} - {formatCurrency(Number(room.pricePerDay))}/dia</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-in *</label>
                <Input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Check-out *</label>
                <Input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Instrucoes Especiais</label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : reservations?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Hotel className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma reserva encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations?.map((reservation: any) => (
            <Card key={reservation.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Dog className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{reservation.pet?.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${statusColors[reservation.status]}`}>
                          {statusLabels[reservation.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Quarto: {reservation.room?.name}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(reservation.checkInDate)} - {formatDate(reservation.checkOutDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {reservation.status === 'CONFIRMED' && (
                      <Button size="sm" onClick={() => checkInMutation.mutate(reservation.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Check-in
                      </Button>
                    )}
                    {reservation.status === 'CHECKED_IN' && (
                      <Button size="sm" variant="outline" onClick={() => checkOutMutation.mutate(reservation.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Check-out
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
