'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Eye, Dog, Cat, Bird } from 'lucide-react';
import Link from 'next/link';

const speciesOptions = [
  { value: 'DOG', label: 'Cachorro', icon: Dog },
  { value: 'CAT', label: 'Gato', icon: Cat },
  { value: 'BIRD', label: 'Ave', icon: Bird },
  { value: 'RODENT', label: 'Roedor', icon: Dog },
  { value: 'REPTILE', label: 'Reptil', icon: Dog },
  { value: 'OTHER', label: 'Outro', icon: Dog },
];

const sizeOptions = [
  { value: 'MINI', label: 'Mini' },
  { value: 'SMALL', label: 'Pequeno' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'LARGE', label: 'Grande' },
  { value: 'GIANT', label: 'Gigante' },
];

export default function PetsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    size: '',
    gender: 'UNKNOWN',
    tutorId: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: petsResponse, isLoading } = useQuery({
    queryKey: ['pets', search],
    queryFn: async () => {
      const response = await api.get('/pets', { params: { search } });
      return response.data;
    },
  });

  const pets = petsResponse?.data || [];

  const { data: tutorsResponse } = useQuery({
    queryKey: ['tutors-select'],
    queryFn: async () => {
      const response = await api.get('/tutors');
      return response.data;
    },
  });

  const tutors = tutorsResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/pets', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast({ title: 'Pet cadastrado com sucesso!' });
      setShowForm(false);
      setFormData({ name: '', species: 'DOG', breed: '', size: '', gender: 'UNKNOWN', tutorId: '' });
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

  const getSpeciesIcon = (species: string) => {
    const spec = speciesOptions.find(s => s.value === species);
    const Icon = spec?.icon || Dog;
    return <Icon className="h-5 w-5" />;
  };

  const getSpeciesLabel = (species: string) => {
    return speciesOptions.find(s => s.value === species)?.label || species;
  };

  const getSizeLabel = (size: string) => {
    return sizeOptions.find(s => s.value === size)?.label || size;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pets</h1>
          <p className="text-gray-600">Gerencie os pets cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pet
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome do pet ou tutor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* New Pet Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Novo Pet</CardTitle>
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
                <label className="block text-sm font-medium mb-1">Tutor *</label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione um tutor</option>
                  {tutors?.map((tutor: any) => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Especie *</label>
                <select
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {speciesOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Raca</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Porte</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione</option>
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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

      {/* Pets List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : pets?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Nenhum pet encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pets?.map((pet: any) => (
            <Card key={pet.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {getSpeciesIcon(pet.species)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pet.name}</h3>
                        <p className="text-sm text-gray-600">
                          {getSpeciesLabel(pet.species)}
                          {pet.breed && ` - ${pet.breed}`}
                        </p>
                        {pet.size && (
                          <p className="text-sm text-gray-500">
                            Porte: {getSizeLabel(pet.size)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Link href={`/dashboard/pets/${pet.id}`}>
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {pet.tutor && (
                      <p className="text-xs text-gray-500 mt-2">
                        Tutor: {pet.tutor.name}
                      </p>
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
