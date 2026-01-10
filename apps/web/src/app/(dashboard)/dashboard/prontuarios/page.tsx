'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  FileText,
  Stethoscope,
  X,
  PawPrint,
  ClipboardList,
  Dog,
  Eye,
  Activity,
} from 'lucide-react';

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
  const totalRecords = recordsResponse?.pagination?.total || records.length;

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
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Stethoscope className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-5 w-5" />
              <span className="text-indigo-100 text-sm font-medium">Registros Medicos</span>
            </div>
            <h1 className="text-2xl font-bold">Prontuarios</h1>
            <p className="text-indigo-100 text-sm mt-1">
              {totalRecords} prontuarios registrados
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Prontuario
          </Button>
        </div>
      </div>

      {/* Barra de Busca */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por pet ou diagnostico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Novo Prontuario */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Stethoscope className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle>Novo Prontuario</CardTitle>
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
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Selecione um pet</option>
                  {pets?.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>{pet.name} - {pet.tutor?.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Queixa Principal *</label>
                <Input
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                  placeholder="Descreva a queixa principal"
                  className="h-11"
                  required
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Historico</label>
                <textarea
                  value={formData.history}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Historico clinico do paciente"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Exame Fisico</label>
                <textarea
                  value={formData.physicalExam}
                  onChange={(e) => setFormData({ ...formData, physicalExam: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Resultados do exame fisico"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Diagnostico</label>
                <Input
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Diagnostico"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tratamento</label>
                <Input
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="Tratamento indicado"
                  className="h-11"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Prescricao</label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Medicamentos e posologia"
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Criar Prontuario'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Prontuarios */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando prontuarios...</p>
        </div>
      ) : records?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-indigo-50 rounded-full w-fit mx-auto mb-4">
              <Stethoscope className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhum prontuario encontrado</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Tente buscar com outros termos' : 'Comece criando o primeiro prontuario'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-indigo-500 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Novo Prontuario
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records?.map((record: any) => (
            <Card key={record.id} className="border-0 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-blue-600" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{record.pet?.name}</h3>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          #{record.id?.slice(-6)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-gray-400" />
                        {record.chiefComplaint}
                      </p>
                      {record.diagnosis && (
                        <p className="text-sm mt-2 px-3 py-1.5 bg-gray-50 rounded-lg inline-block">
                          <strong className="text-gray-700">Diagnostico:</strong> {record.diagnosis}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                        <Dog className="h-3.5 w-3.5" />
                        {formatDate(record.createdAt)}
                        {record.veterinarian?.name && (
                          <>
                            <span className="text-gray-300">•</span>
                            Dr(a). {record.veterinarian?.name}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
