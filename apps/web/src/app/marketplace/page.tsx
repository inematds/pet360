'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Search, Star, Truck, Filter, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [freeShipping, setFreeShipping] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['marketplace-categories'],
    queryFn: async () => {
      const response = await api.get('/marketplace/categories');
      return response.data;
    },
  });

  const { data: listings, isLoading } = useQuery({
    queryKey: ['marketplace-listings', search, categoryId, sortBy, freeShipping],
    queryFn: async () => {
      const response = await api.get('/marketplace/listings', {
        params: { search, categoryId, sortBy, freeShipping: freeShipping || undefined },
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
              Pet360 Marketplace
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/marketplace" className="text-gray-700 hover:text-primary">
                Produtos
              </Link>
              <Link href="/pet-sitters" className="text-gray-700 hover:text-primary">
                Cuidadores
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary">
                Entrar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar produtos, racoes, acessorios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Todas as categorias</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Ordenar por</option>
            <option value="price_asc">Menor preco</option>
            <option value="price_desc">Maior preco</option>
            <option value="rating">Melhor avaliados</option>
            <option value="sales">Mais vendidos</option>
          </select>
          <Button
            variant={freeShipping ? 'default' : 'outline'}
            onClick={() => setFreeShipping(!freeShipping)}
          >
            <Truck className="h-4 w-4 mr-2" />
            Frete Gratis
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={!categoryId ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoryId('')}
          >
            Todos
          </Button>
          {categories?.map((cat: any) => (
            <Button
              key={cat.id}
              variant={categoryId === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryId(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : listings?.listings?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings?.listings?.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                  {product.freeShipping && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Frete Gratis
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{product.seller?.name}</p>
                  <h3 className="font-medium line-clamp-2 mb-2">{product.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">
                      {Number(product.averageRating).toFixed(1)} ({product.totalReviews})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(Number(product.price))}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </span>
                    )}
                  </div>
                  <Link href={`/marketplace/${product.id}`}>
                    <Button className="w-full mt-3" size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ver Produto
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {listings?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: listings.totalPages }, (_, i) => (
              <Button key={i} variant={listings.page === i + 1 ? 'default' : 'outline'} size="sm">
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
