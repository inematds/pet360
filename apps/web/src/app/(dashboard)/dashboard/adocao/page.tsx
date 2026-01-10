'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Heart,
  Dog,
  Cat,
  X,
  PawPrint,
  Eye,
  Sparkles,
} from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  AVAILABLE: { bg: 'bg-green-50', text: 'text-green-700', label: 'Disponivel' },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Em Processo' },
  ADOPTED: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Adotado' },
  UNAVAILABLE: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Indisponivel' },
};

export default function AdocaoPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    estimatedAge: '',
    gender: 'UNKNOWN',
    size: '',
    description: '',
    healthNotes: '',
    temperament: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: animalsResponse, isLoading } = useQuery({
    queryKey: ['adoption-animals', search],
    queryFn: async () => {
      const response = await api.get('/adoption/animals', { params: { search } });
      return response.data;
    },
  });

  const animals = animalsResponse?.data || [];
  const totalAnimals = animalsResponse?.pagination?.total || animals.length;
  const availableCount = animals.filter((a: any) => a.status === 'AVAILABLE').length;

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/adoption/animals', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adoption-animals'] });
      toast({ title: 'Animal cadastrado com sucesso!' });
      setShowForm(false);
      setFormData({ name: '', species: 'DOG', breed: '', estimatedAge: '', gender: 'UNKNOWN', size: '', description: '', healthNotes: '', temperament: '' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao cadastrar',
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Heart className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-5 w-5" />
              <span className="text-rose-100 text-sm font-medium">Encontre um Lar</span>
            </div>
            <h1 className="text-2xl font-bold">Adocao</h1>
            <p className="text-rose-100 text-sm mt-1">
              {availableCount} animais disponiveis para adocao
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-rose-600 hover:bg-rose-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Animal
          </Button>
        </div>
      </div>

      {/* Barra de Busca */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou raca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Novo Animal */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 rounded-xl">
                  <Heart className="h-5 w-5 text-rose-600" />
                </div>
                <CardTitle>Cadastrar Animal para Adocao</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do animal"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Especie *</label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="DOG">Cachorro</option>
                  <option value="CAT">Gato</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Raca</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Ex: SRD, Labrador"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Idade Estimada</label>
                <Input
                  value={formData.estimatedAge}
                  onChange={(e) => setFormData({ ...formData, estimatedAge: e.target.value })}
                  placeholder="Ex: 2 anos"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="UNKNOWN">Nao informado</option>
                  <option value="MALE">Macho</option>
                  <option value="FEMALE">Femea</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Porte</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Selecione</option>
                  <option value="MINI">Mini</option>
                  <option value="SMALL">Pequeno</option>
                  <option value="MEDIUM">Medio</option>
                  <option value="LARGE">Grande</option>
                  <option value="GIANT">Gigante</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Descricao</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Conte a historia do animal..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Temperamento</label>
                <Input
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  placeholder="Ex: Docil, brincalhao"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Notas de Saude</label>
                <Input
                  value={formData.healthNotes}
                  onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                  placeholder="Ex: Castrado, vacinado"
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
                  className="px-6 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Cadastrar Animal'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Animais */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-rose-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando animais...</p>
        </div>
      ) : animals?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-rose-50 rounded-full w-fit mx-auto mb-4">
              <Heart className="h-10 w-10 text-rose-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhum animal para adocao</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Tente buscar com outros termos' : 'Cadastre animais para encontrar um lar'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-rose-500 to-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Animal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {animals?.map((animal: any) => {
            const status = statusConfig[animal.status] || statusConfig.AVAILABLE;

            return (
              <Card key={animal.id} className="group border-0 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center relative">
                  {animal.species === 'DOG' ? (
                    <Dog className="h-20 w-20 text-rose-300" />
                  ) : animal.species === 'CAT' ? (
                    <Cat className="h-20 w-20 text-rose-300" />
                  ) : (
                    <Heart className="h-20 w-20 text-rose-300" />
                  )}
                  <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{animal.name}</h3>
                      <p className="text-sm text-gray-600">
                        {animal.breed || 'SRD'} • {animal.estimatedAge || 'Idade desconhecida'}
                      </p>
                    </div>

                    {animal.temperament && (
                      <div className="flex flex-wrap gap-1.5">
                        {animal.temperament.split(',').slice(0, 3).map((trait: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-full text-xs">
                            {trait.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {animal.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{animal.description}</p>
                    )}

                    <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
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
