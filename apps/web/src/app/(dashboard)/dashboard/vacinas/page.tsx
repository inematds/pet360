'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Plus, Search, Syringe, AlertTriangle, Calendar } from 'lucide-react';

export default function VacinasPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    vaccineName: '',
    vaccineType: '',
    manufacturer: '',
    batchNumber: '',
    applicationDate: '',
    nextDueDate: '',
    notes: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vaccinesResponse, isLoading } = useQuery({
    queryKey: ['vaccines', search],
    queryFn: async () => {
      const response = await api.get('/vaccines', { params: { search } });
      return response.data;
    },
  });

  const vaccines = vaccinesResponse?.data || [];

  const { data: pendingResponse } = useQuery({
    queryKey: ['vaccines-pending'],
    queryFn: async () => {
      const response = await api.get('/vaccines/pending', { params: { days: 30 } });
      return response.data;
    },
  });

  const pending = pendingResponse?.data || [];

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
      const response = await api.post('/vaccines', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccines'] });
      queryClient.invalidateQueries({ queryKey: ['vaccines-pending'] });
      toast({ title: 'Vacina registrada com sucesso!' });
      setShowForm(false);
      setFormData({ petId: '', vaccineName: '', vaccineType: '', manufacturer: '', batchNumber: '', applicationDate: '', nextDueDate: '', notes: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar vacina',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
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
          <h1 className="text-2xl font-bold">Vacinas</h1>
          <p className="text-gray-600">Controle de vacinacao</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Vacina
        </Button>
      </div>

      {pending?.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Vacinas Proximas (30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pending.slice(0, 5).map((v: any) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span>{v.pet?.name} - {v.vaccineName}</span>
                  <span className="text-orange-600">{formatDate(v.nextDueDate)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por pet ou vacina..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Vacina</CardTitle>
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
                <label className="block text-sm font-medium mb-1">Nome da Vacina *</label>
                <Input
                  value={formData.vaccineName}
                  onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                  placeholder="Ex: V10, Antirrabica"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fabricante</label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lote</label>
                <Input
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data Aplicacao *</label>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Proxima Dose</label>
                <Input
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
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
      ) : vaccines?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Syringe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma vacina registrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vaccines?.map((vaccine: any) => (
            <Card key={vaccine.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Syringe className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{vaccine.vaccineName}</h3>
                      <p className="text-sm text-gray-600">{vaccine.pet?.name}</p>
                      <p className="text-xs text-gray-500">
                        Aplicada em: {formatDate(vaccine.applicationDate)}
                      </p>
                    </div>
                  </div>
                  {vaccine.nextDueDate && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Proxima: {formatDate(vaccine.nextDueDate)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
