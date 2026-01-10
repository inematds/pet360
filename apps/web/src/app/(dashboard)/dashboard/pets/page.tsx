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
  Dog,
  Cat,
  Bird,
  X,
  PawPrint,
  ArrowRight,
  Syringe,
  Calendar,
  User,
  Weight,
} from 'lucide-react';
import Link from 'next/link';

const speciesOptions = [
  { value: 'DOG', label: 'Cachorro', icon: Dog, color: 'from-amber-400 to-orange-500', bgLight: 'bg-orange-50', textColor: 'text-orange-600' },
  { value: 'CAT', label: 'Gato', icon: Cat, color: 'from-purple-400 to-violet-500', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
  { value: 'BIRD', label: 'Ave', icon: Bird, color: 'from-sky-400 to-blue-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
  { value: 'RODENT', label: 'Roedor', icon: PawPrint, color: 'from-pink-400 to-rose-500', bgLight: 'bg-pink-50', textColor: 'text-pink-600' },
  { value: 'REPTILE', label: 'Reptil', icon: PawPrint, color: 'from-green-400 to-emerald-500', bgLight: 'bg-green-50', textColor: 'text-green-600' },
  { value: 'OTHER', label: 'Outro', icon: PawPrint, color: 'from-gray-400 to-slate-500', bgLight: 'bg-gray-50', textColor: 'text-gray-600' },
];

const sizeOptions = [
  { value: 'MINI', label: 'Mini' },
  { value: 'SMALL', label: 'Pequeno' },
  { value: 'MEDIUM', label: 'Medio' },
  { value: 'LARGE', label: 'Grande' },
  { value: 'GIANT', label: 'Gigante' },
];

const genderOptions = [
  { value: 'MALE', label: 'Macho' },
  { value: 'FEMALE', label: 'Femea' },
  { value: 'UNKNOWN', label: 'Nao informado' },
];

export default function PetsPage() {
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('');
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
    queryKey: ['pets', search, speciesFilter],
    queryFn: async () => {
      const params: any = { search };
      if (speciesFilter) params.species = speciesFilter;
      const response = await api.get('/pets', { params });
      return response.data;
    },
  });

  const pets = petsResponse?.data || [];
  const totalPets = petsResponse?.pagination?.total || pets.length;

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

  const getSpeciesConfig = (species: string) => {
    return speciesOptions.find(s => s.value === species) || speciesOptions[5];
  };

  const getSizeLabel = (size: string) => {
    return sizeOptions.find(s => s.value === size)?.label || size;
  };

  const getGenderLabel = (gender: string) => {
    return genderOptions.find(g => g.value === gender)?.label || gender;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <PawPrint className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="absolute left-0 bottom-0 opacity-10">
          <Dog className="h-32 w-32 translate-y-4 -translate-x-4" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PawPrint className="h-5 w-5" />
              <span className="text-purple-100 text-sm font-medium">Gestao de Pets</span>
            </div>
            <h1 className="text-2xl font-bold">Pets</h1>
            <p className="text-purple-100 text-sm mt-1">
              {totalPets} pets cadastrados
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pet
          </Button>
        </div>
      </div>

      {/* Filtros por Especie */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={speciesFilter === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSpeciesFilter('')}
          className={speciesFilter === '' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Todos
        </Button>
        {speciesOptions.slice(0, 4).map((spec) => (
          <Button
            key={spec.value}
            variant={speciesFilter === spec.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSpeciesFilter(spec.value)}
            className={speciesFilter === spec.value ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <spec.icon className="h-4 w-4 mr-1" />
            {spec.label}
          </Button>
        ))}
      </div>

      {/* Barra de Busca */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome do pet, raca ou microchip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Novo Pet */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <PawPrint className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Novo Pet</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome do pet *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Rex, Luna, Thor..."
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tutor *</label>
                <select
                  value={formData.tutorId}
                  onChange={(e) => setFormData({ ...formData, tutorId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Selecione um tutor</option>
                  {tutors?.map((tutor: any) => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Especie *</label>
                <div className="grid grid-cols-3 gap-2">
                  {speciesOptions.slice(0, 6).map((spec) => (
                    <button
                      key={spec.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, species: spec.value })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                        formData.species === spec.value
                          ? `border-purple-500 ${spec.bgLight}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <spec.icon className={`h-5 w-5 ${formData.species === spec.value ? spec.textColor : 'text-gray-400'}`} />
                      <span className={`text-xs font-medium ${formData.species === spec.value ? spec.textColor : 'text-gray-600'}`}>
                        {spec.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Raca</label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Ex: Golden Retriever, Siames..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Porte</label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecione o porte</option>
                  {sizeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {genderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-6 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Cadastrar Pet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pets */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando pets...</p>
        </div>
      ) : pets?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-4">
              <PawPrint className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhum pet encontrado</h3>
            <p className="text-gray-500 mb-4">
              {search || speciesFilter ? 'Tente buscar com outros termos' : 'Comece cadastrando seu primeiro pet'}
            </p>
            {!search && !speciesFilter && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-500 to-violet-600">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Pet
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pets?.map((pet: any) => {
            const speciesConfig = getSpeciesConfig(pet.species);
            const SpeciesIcon = speciesConfig.icon;

            return (
              <Link key={pet.id} href={`/dashboard/pets/${pet.id}`}>
                <Card className="group border-0 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer h-full overflow-hidden">
                  <CardContent className="p-0">
                    {/* Header do Card com Gradiente */}
                    <div className={`relative bg-gradient-to-br ${speciesConfig.color} p-4 pb-8`}>
                      <div className="flex items-center justify-between">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                          <SpeciesIcon className="h-6 w-6 text-white" />
                        </div>
                        <span className={`px-2 py-1 ${speciesConfig.bgLight} ${speciesConfig.textColor} rounded-full text-xs font-medium`}>
                          {speciesConfig.label}
                        </span>
                      </div>
                      <div className="absolute -bottom-6 left-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                          {pet.photoUrl ? (
                            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <SpeciesIcon className={`h-8 w-8 ${speciesConfig.textColor}`} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Conteudo */}
                    <div className="p-4 pt-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors">
                            {pet.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {pet.breed || 'Sem raca definida'}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      {/* Info */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {pet.size && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            <Weight className="h-3 w-3" />
                            {getSizeLabel(pet.size)}
                          </span>
                        )}
                        {pet.gender && pet.gender !== 'UNKNOWN' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                            {getGenderLabel(pet.gender)}
                          </span>
                        )}
                        {pet._count?.vaccineRecords > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                            <Syringe className="h-3 w-3" />
                            {pet._count.vaccineRecords}
                          </span>
                        )}
                        {pet._count?.appointments > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                            <Calendar className="h-3 w-3" />
                            {pet._count.appointments}
                          </span>
                        )}
                      </div>

                      {/* Tutor */}
                      {pet.tutor && (
                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Tutor: {pet.tutor.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
