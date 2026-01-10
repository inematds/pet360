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
  Syringe,
  AlertTriangle,
  Calendar,
  X,
  PawPrint,
  Dog,
  Clock,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

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
  const totalVaccines = vaccinesResponse?.pagination?.total || vaccines.length;

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
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Syringe className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Syringe className="h-5 w-5" />
              <span className="text-orange-100 text-sm font-medium">Controle de Vacinacao</span>
            </div>
            <h1 className="text-2xl font-bold">Vacinas</h1>
            <p className="text-orange-100 text-sm mt-1">
              {totalVaccines} vacinas registradas
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Vacina
          </Button>
        </div>
      </div>

      {/* Alerta de Vacinas Proximas */}
      {pending?.length > 0 && (
        <Card className="border-0 shadow-card bg-gradient-to-r from-orange-50 to-amber-50 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800 mb-2">
                  Vacinas Proximas (30 dias)
                </h3>
                <div className="space-y-2">
                  {pending.slice(0, 5).map((v: any) => (
                    <Link key={v.id} href={`/dashboard/pets/${v.pet?.id}`}>
                      <div className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/50 transition-colors group">
                        <div className="flex items-center gap-2">
                          <Dog className="h-4 w-4 text-orange-500" />
                          <span className="text-gray-700">{v.pet?.name}</span>
                          <span className="text-gray-400">-</span>
                          <span className="font-medium text-gray-900">{v.vaccineName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 font-medium">{formatDate(v.nextDueDate)}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {pending.length > 5 && (
                  <p className="text-sm text-orange-600 mt-2">
                    + {pending.length - 5} outras vacinas proximas
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barra de Busca */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por pet ou vacina..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Nova Vacina */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Syringe className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle>Registrar Vacina</CardTitle>
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
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Selecione um pet</option>
                  {pets?.map((pet: any) => (
                    <option key={pet.id} value={pet.id}>{pet.name} - {pet.tutor?.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome da Vacina *</label>
                <Input
                  value={formData.vaccineName}
                  onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                  placeholder="Ex: V10, Antirrabica, V8..."
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Fabricante</label>
                <Input
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  placeholder="Nome do fabricante"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Lote</label>
                <Input
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  placeholder="Numero do lote"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data de Aplicacao *</label>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Proxima Dose</label>
                <Input
                  type="date"
                  value={formData.nextDueDate}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
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
                  className="px-6 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Registrar Vacina'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Vacinas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-orange-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando vacinas...</p>
        </div>
      ) : vaccines?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-orange-50 rounded-full w-fit mx-auto mb-4">
              <Syringe className="h-10 w-10 text-orange-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhuma vacina registrada</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Tente buscar com outros termos' : 'Comece registrando a primeira vacina'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-orange-500 to-amber-600">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Vacina
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vaccines?.map((vaccine: any) => (
            <Card key={vaccine.id} className="group border-0 shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                    <Syringe className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {vaccine.vaccineName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Dog className="h-3.5 w-3.5 text-gray-400" />
                      <span className="truncate">{vaccine.pet?.name}</span>
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Aplicada:</span>
                    <span className="font-medium text-gray-900">{formatDate(vaccine.applicationDate)}</span>
                  </div>
                  {vaccine.nextDueDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-gray-600">Proxima:</span>
                      <span className="font-medium text-orange-600">{formatDate(vaccine.nextDueDate)}</span>
                    </div>
                  )}
                </div>

                {vaccine.manufacturer && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                      {vaccine.manufacturer}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
