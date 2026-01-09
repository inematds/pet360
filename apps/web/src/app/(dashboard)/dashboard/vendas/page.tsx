'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, ShoppingCart, Receipt, DollarSign } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Vendas</h1>
          <p className="text-gray-600">Registrar e consultar vendas</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por cliente ou numero..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nova Venda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Cliente (opcional)</label>
                  <select
                    value={tutorId}
                    onChange={(e) => setTutorId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Consumidor Final</option>
                    {tutors?.map((tutor: any) => (
                      <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="CASH">Dinheiro</option>
                    <option value="CREDIT_CARD">Cartao Credito</option>
                    <option value="DEBIT_CARD">Cartao Debito</option>
                    <option value="PIX">PIX</option>
                  </select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Adicionar Produtos</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                    className="w-20"
                  />
                  <Button type="button" onClick={addItem} disabled={!selectedProduct}>
                    Adicionar
                  </Button>
                </div>

                {items.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {items.map((item, index) => {
                      const product = products.find((p: any) => p.id === item.productId);
                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b">
                          <div>
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                              Remover
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between pt-2 font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setItems([]); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || items.length === 0}>
                  {createMutation.isPending ? 'Finalizando...' : 'Finalizar Venda'}
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
      ) : sales?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma venda registrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sales?.map((sale: any) => (
            <Card key={sale.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Receipt className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">#{sale.saleNumber}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {sale.tutor?.name || 'Consumidor Final'} - {sale.items?.length || 0} itens
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(sale.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                      <DollarSign className="h-5 w-5" />
                      {formatCurrency(Number(sale.totalAmount))}
                    </div>
                    <p className="text-xs text-gray-500">{sale.paymentMethod}</p>
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
