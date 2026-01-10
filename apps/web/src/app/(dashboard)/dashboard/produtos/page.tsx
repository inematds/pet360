'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  Edit,
  X,
  PawPrint,
  Tag,
  Boxes,
  TrendingDown,
  BarChart3,
} from 'lucide-react';

export default function ProdutosPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    description: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
    unit: 'UN',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await api.get('/products', { params: { search } });
      return response.data;
    },
  });

  const products = productsResponse?.data || [];
  const totalProducts = productsResponse?.pagination?.total || products.length;

  const { data: lowStockResponse } = useQuery({
    queryKey: ['products-low-stock'],
    queryFn: async () => {
      const response = await api.get('/products/low-stock');
      return response.data;
    },
  });

  const lowStock = lowStockResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/products', {
        ...data,
        costPrice: parseFloat(data.costPrice) || 0,
        salePrice: parseFloat(data.salePrice) || 0,
        stock: parseInt(data.stock) || 0,
        minStock: parseInt(data.minStock) || 0,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Produto cadastrado com sucesso!' });
      setShowForm(false);
      setFormData({ name: '', sku: '', barcode: '', category: '', description: '', costPrice: '', salePrice: '', stock: '', minStock: '', unit: 'UN' });
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <Package className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-5 w-5" />
              <span className="text-purple-100 text-sm font-medium">Gestao de Estoque</span>
            </div>
            <h1 className="text-2xl font-bold">Produtos</h1>
            <p className="text-purple-100 text-sm mt-1">
              {totalProducts} produtos cadastrados
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Alerta de Estoque Baixo */}
      {lowStock?.length > 0 && (
        <Card className="border-0 shadow-card bg-gradient-to-r from-orange-50 to-amber-50 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Estoque Baixo
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {lowStock.slice(0, 6).map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-2 bg-white/50 rounded-lg">
                      <span className="text-gray-700 truncate mr-2">{p.name}</span>
                      <span className="text-orange-600 font-medium whitespace-nowrap">{p.stock} {p.unit}</span>
                    </div>
                  ))}
                </div>
                {lowStock.length > 6 && (
                  <p className="text-sm text-orange-600 mt-2">
                    + {lowStock.length - 6} outros produtos
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
              placeholder="Buscar por nome, SKU ou codigo de barras..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Novo Produto */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle>Novo Produto</CardTitle>
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
                  placeholder="Nome do produto"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Codigo SKU"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Codigo de Barras</label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="EAN / Codigo de barras"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Racao, Acessorios, Medicamentos"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preco de Custo</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="0,00"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preco de Venda *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  placeholder="0,00"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estoque Atual</label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Estoque Minimo</label>
                <Input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  placeholder="5"
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
                  className="px-6 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                >
                  {createMutation.isPending ? 'Salvando...' : 'Cadastrar Produto'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Produtos */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-purple-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando produtos...</p>
        </div>
      ) : products?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-4">
              <Package className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Tente buscar com outros termos' : 'Comece cadastrando o primeiro produto'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-purple-500 to-violet-600">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Produto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product: any) => {
            const isLowStock = product.stock <= (product.minStock || 5);

            return (
              <Card key={product.id} className="group border-0 shadow-card hover:shadow-card-hover transition-all overflow-hidden">
                <div className={`h-1 ${isLowStock ? 'bg-orange-500' : 'bg-purple-500'}`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${isLowStock ? 'bg-orange-100' : 'bg-purple-100'}`}>
                          <Package className={`h-5 w-5 ${isLowStock ? 'text-orange-600' : 'text-purple-600'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          {product.sku && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <Tag className="h-3 w-3" />
                              SKU: {product.sku}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Preco</span>
                          <span className="text-lg font-bold text-purple-600">
                            {formatCurrency(Number(product.salePrice))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Estoque</span>
                          <div className="flex items-center gap-2">
                            <Boxes className={`h-4 w-4 ${isLowStock ? 'text-orange-500' : 'text-gray-400'}`} />
                            <span className={`font-medium ${isLowStock ? 'text-orange-600' : 'text-gray-700'}`}>
                              {product.stock} {product.unit}
                            </span>
                          </div>
                        </div>
                      </div>

                      {product.category && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit className="h-4 w-4 text-gray-500" />
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
