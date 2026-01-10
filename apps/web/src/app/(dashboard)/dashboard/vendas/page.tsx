'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Plus,
  Search,
  ShoppingCart,
  Receipt,
  DollarSign,
  X,
  PawPrint,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  User,
  Package,
} from 'lucide-react';

const paymentMethodConfig: Record<string, { label: string; icon: any; color: string }> = {
  CASH: { label: 'Dinheiro', icon: Banknote, color: 'text-green-600 bg-green-50' },
  CREDIT_CARD: { label: 'Credito', icon: CreditCard, color: 'text-blue-600 bg-blue-50' },
  DEBIT_CARD: { label: 'Debito', icon: CreditCard, color: 'text-purple-600 bg-purple-50' },
  PIX: { label: 'PIX', icon: Smartphone, color: 'text-teal-600 bg-teal-50' },
};

export default function VendasPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [tutorId, setTutorId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: salesResponse, isLoading } = useQuery({
    queryKey: ['sales', search],
    queryFn: async () => {
      const response = await api.get('/sales', { params: { search } });
      return response.data;
    },
  });

  const sales = salesResponse?.data || [];
  const totalSales = salesResponse?.pagination?.total || sales.length;

  const { data: productsResponse } = useQuery({
    queryKey: ['products-select'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data;
    },
  });

  const products = productsResponse?.data || [];

  const { data: tutorsResponse } = useQuery({
    queryKey: ['tutors-select'],
    queryFn: async () => {
      const response = await api.get('/tutors');
      return response.data;
    },
  });

  const tutors = tutorsResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/sales', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Venda registrada com sucesso!' });
      setShowForm(false);
      setItems([]);
      setTutorId('');
      setPaymentMethod('CASH');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar venda',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const addItem = () => {
    const product = products.find((p: any) => p.id === selectedProduct);
    if (product) {
      setItems([...items, {
        productId: product.id,
        quantity: parseInt(quantity) || 1,
        price: Number(product.salePrice),
      }]);
      setSelectedProduct('');
      setQuantity('1');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: 'Adicione pelo menos um item', variant: 'destructive' });
      return;
    }
    createMutation.mutate({
      tutorId: tutorId || null,
      paymentMethod,
      items,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <ShoppingCart className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-green-100 text-sm font-medium">Ponto de Venda</span>
            </div>
            <h1 className="text-2xl font-bold">Vendas</h1>
            <p className="text-green-100 text-sm mt-1">
              {totalSales} vendas registradas
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-white text-green-600 hover:bg-green-50 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>
      </div>

      {/* Barra de Busca */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por cliente ou numero..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 text-base border-0 bg-gray-50 focus:bg-white transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Nova Venda */}
      {showForm && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Nova Venda</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => { setShowForm(false); setItems([]); }}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Cliente (opcional)</label>
                  <select
                    value={tutorId}
                    onChange={(e) => setTutorId(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Consumidor Final</option>
                    {tutors?.map((tutor: any) => (
                      <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="CASH">Dinheiro</option>
                    <option value="CREDIT_CARD">Cartao de Credito</option>
                    <option value="DEBIT_CARD">Cartao de Debito</option>
                    <option value="PIX">PIX</option>
                  </select>
                </div>
              </div>

              {/* Adicionar Produtos */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  Adicionar Produtos
                </h4>
                <div className="flex gap-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex h-11 flex-1 rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione um produto</option>
                    {products?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name} - {formatCurrency(Number(p.salePrice))}</option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-20 h-11 bg-white"
                  />
                  <Button type="button" onClick={addItem} disabled={!selectedProduct} className="bg-green-500 hover:bg-green-600">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lista de Itens */}
                {items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {items.map((item, index) => {
                      const product = products.find((p: any) => p.id === item.productId);
                      return (
                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <Package className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{product?.name}</span>
                              <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between pt-4 mt-2 border-t border-gray-200">
                      <span className="text-lg font-semibold text-gray-700">Total:</span>
                      <span className="text-2xl font-bold text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setItems([]); }} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || items.length === 0}
                  className="px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {createMutation.isPending ? 'Finalizando...' : 'Finalizar Venda'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Vendas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
            <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
          </div>
          <p className="mt-4 text-gray-500">Carregando vendas...</p>
        </div>
      ) : sales?.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="py-16 text-center">
            <div className="p-4 bg-green-50 rounded-full w-fit mx-auto mb-4">
              <ShoppingCart className="h-10 w-10 text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nenhuma venda registrada</h3>
            <p className="text-gray-500 mb-4">
              {search ? 'Tente buscar com outros termos' : 'Comece registrando a primeira venda'}
            </p>
            {!search && (
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-green-500 to-emerald-600">
                <Plus className="h-4 w-4 mr-2" />
                Nova Venda
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sales?.map((sale: any) => {
            const payment = paymentMethodConfig[sale.paymentMethod] || paymentMethodConfig.CASH;
            const PaymentIcon = payment.icon;

            return (
              <Card key={sale.id} className="border-0 shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
                        <Receipt className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">#{sale.saleNumber}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${payment.color}`}>
                            <PaymentIcon className="h-3 w-3" />
                            {payment.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          {sale.tutor?.name || 'Consumidor Final'}
                          <span className="text-gray-400">•</span>
                          {sale.items?.length || 0} itens
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(sale.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xl font-bold text-green-600">
                        <DollarSign className="h-5 w-5" />
                        {formatCurrency(Number(sale.totalAmount))}
                      </div>
                    </div>
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
