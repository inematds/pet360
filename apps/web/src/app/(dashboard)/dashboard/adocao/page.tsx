'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import { Plus, Search, Heart, Dog, Cat } from 'lucide-react';

const statusColors: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  ADOPTED: 'bg-blue-100 text-blue-800',
  UNAVAILABLE: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponivel',
  PENDING: 'Em Processo',
  ADOPTED: 'Adotado',
  UNAVAILABLE: 'Indisponivel',
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Adocao</h1>
          <p className="text-gray-600">Animais disponiveis para adocao</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar Animal
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou raca..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Cadastrar Animal para Adocao</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Nome *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Especie *</label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="DOG">Cachorro</option>
                  <option value="CAT">Gato</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raca</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Ex: SRD, Labrador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Idade Estimada</label>
                <Input
                  value={formData.estimatedAge}
                  onChange={(e) => setFormData({ ...formData, estimatedAge: e.target.value })}
                  placeholder="Ex: 2 anos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="UNKNOWN">Nao informado</option>
                  <option value="MALE">Macho</option>
                  <option value="FEMALE">Femea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Porte</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  <option value="MINI">Mini</option>
                  <option value="SMALL">Pequeno</option>
                  <option value="MEDIUM">Medio</option>
                  <option value="LARGE">Grande</option>
                  <option value="GIANT">Gigante</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Descricao</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Conte a historia do animal..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temperamento</label>
                <Input
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  placeholder="Ex: Docil, brincalhao"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notas de Saude</label>
                <Input
                  value={formData.healthNotes}
                  onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
                  placeholder="Ex: Castrado, vacinado"
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
      ) : animals?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum animal para adocao</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {animals?.map((animal: any) => (
            <Card key={animal.id} className="overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {animal.species === 'DOG' ? (
                  <Dog className="h-16 w-16 text-gray-400" />
                ) : animal.species === 'CAT' ? (
                  <Cat className="h-16 w-16 text-gray-400" />
                ) : (
                  <Heart className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{animal.name}</h3>
                    <p className="text-sm text-gray-600">
                      {animal.breed || 'SRD'} - {animal.estimatedAge || 'Idade desconhecida'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[animal.status]}`}>
                    {statusLabels[animal.status]}
                  </span>
                </div>
                {animal.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{animal.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1">Ver Detalhes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
