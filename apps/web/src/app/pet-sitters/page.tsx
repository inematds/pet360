'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Search, Star, MapPin, Dog, Cat, Car, Home, Filter, Check } from 'lucide-react';
import Link from 'next/link';

const serviceTypes = [
  { value: 'WALK', label: 'Passeio' },
  { value: 'DAYCARE', label: 'Creche' },
  { value: 'BOARDING', label: 'Hospedagem' },
  { value: 'VISIT', label: 'Visita' },
  { value: 'GROOMING', label: 'Banho' },
];

export default function PetSittersPage() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [species, setSpecies] = useState('');

  const { data: petSitters, isLoading } = useQuery({
    queryKey: ['pet-sitters', search, city, serviceType, species],
    queryFn: async () => {
      const response = await api.get('/pet-sitters', {
        params: { search, city, serviceType, species },
      });
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              Pet360 Cuidadores
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="text-gray-700 hover:text-primary">
                Produtos
              </Link>
              <Link href="/pet-sitters" className="text-gray-700 hover:text-primary">
                Cuidadores
              </Link>
              <Link href="/pet-sitters/cadastro" className="text-gray-700 hover:text-primary">
                Seja um Cuidador
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary">
                Entrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Encontre Cuidadores de Confianca
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Passeios, hospedagem, creche e mais. Profissionais verificados perto de voce.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tipo de servico</option>
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Tipo de pet</option>
                <option value="DOG">Cachorro</option>
                <option value="CAT">Gato</option>
                <option value="BIRD">Ave</option>
                <option value="OTHER">Outro</option>
              </select>
              <Button className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Type Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={!serviceType ? 'default' : 'outline'}
            size="sm"
            onClick={() => setServiceType('')}
          >
            Todos
          </Button>
          {serviceTypes.map((type) => (
            <Button
              key={type.value}
              variant={serviceType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setServiceType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : petSitters?.petSitters?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum cuidador encontrado na sua regiao</p>
            <p className="text-sm text-gray-400 mt-2">
              Tente alterar os filtros ou expandir a area de busca
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {petSitters?.petSitters?.map((sitter: any) => (
              <Card key={sitter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-gray-100">
                    {sitter.photoUrl ? (
                      <img
                        src={sitter.photoUrl}
                        alt={sitter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-3xl text-primary">
                            {sitter.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    {sitter.isVerified && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{sitter.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {sitter.city}, {sitter.state}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">
                          {Number(sitter.averageRating).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({sitter.totalReviews})
                        </span>
                      </div>
                    </div>

                    {sitter.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {sitter.bio}
                      </p>
                    )}

                    {/* Accepted Pets */}
                    <div className="flex items-center gap-2 mb-3">
                      {sitter.acceptedSpecies?.includes('DOG') && (
                        <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                          <Dog className="h-3 w-3" /> Cachorros
                        </span>
                      )}
                      {sitter.acceptedSpecies?.includes('CAT') && (
                        <span className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                          <Cat className="h-3 w-3" /> Gatos
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
                      {sitter.hasOwnTransport && (
                        <span className="flex items-center gap-1">
                          <Car className="h-3 w-3" /> Transporte
                        </span>
                      )}
                      {sitter.hasYard && (
                        <span className="flex items-center gap-1">
                          <Home className="h-3 w-3" /> Quintal
                        </span>
                      )}
                    </div>

                    {/* Services */}
                    {sitter.services?.length > 0 && (
                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs text-gray-500 mb-2">Servicos a partir de:</p>
                        <div className="flex flex-wrap gap-2">
                          {sitter.services.slice(0, 3).map((service: any) => (
                            <span
                              key={service.id}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                            >
                              {service.name}: {formatCurrency(Number(service.price))}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link href={`/pet-sitters/${sitter.id}`}>
                      <Button className="w-full mt-4">Ver Perfil</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {petSitters?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: petSitters.totalPages }, (_, i) => (
              <Button key={i} variant={petSitters.page === i + 1 ? 'default' : 'outline'} size="sm">
                {i + 1}
              </Button>
            ))}
          </div>
        )}

        {/* CTA */}
        <Card className="mt-12 bg-primary text-white">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Quer ser um Cuidador?</h2>
            <p className="mb-4 opacity-90">
              Cadastre-se e comece a ganhar dinheiro cuidando de pets
            </p>
            <Link href="/pet-sitters/cadastro">
              <Button variant="secondary" size="lg">
                Cadastrar como Cuidador
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
