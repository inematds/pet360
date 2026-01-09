'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Plus, Search, FileText, Stethoscope } from 'lucide-react';

export default function ProntuariosPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    appointmentId: '',
    chiefComplaint: '',
    history: '',
    physicalExam: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    notes: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recordsResponse, isLoading } = useQuery({
    queryKey: ['medical-records', search],
    queryFn: async () => {
      const response = await api.get('/medical-records', { params: { search } });
      return response.data;
    },
  });

  const records = recordsResponse?.data || [];

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
      const response = await api.post('/medical-records', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast({ title: 'Prontuario criado com sucesso!' });
      setShowForm(false);
      setFormData({ petId: '', appointmentId: '', chiefComplaint: '', history: '', physicalExam: '', diagnosis: '', treatment: '', prescription: '', notes: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar prontuario',
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
          <h1 className="text-2xl font-bold">Prontuarios</h1>
          <p className="text-gray-600">Registros medicos dos pets</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Prontuario
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por pet ou diagnostico..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Prontuario</CardTitle>
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
                <label className="block text-sm font-medium mb-1">Queixa Principal *</label>
                <Input
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Historico</label>
                <textarea
                  value={formData.history}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Exame Fisico</label>
                <textarea
                  value={formData.physicalExam}
                  onChange={(e) => setFormData({ ...formData, physicalExam: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Diagnostico</label>
                <Input
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tratamento</label>
                <Input
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Prescricao</label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
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
      ) : records?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum prontuario encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records?.map((record: any) => (
            <Card key={record.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{record.pet?.name}</h3>
                      <p className="text-sm text-gray-600">{record.chiefComplaint}</p>
                      {record.diagnosis && (
                        <p className="text-sm mt-1"><strong>Diagnostico:</strong> {record.diagnosis}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(record.createdAt)} - Dr(a). {record.veterinarian?.name}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
