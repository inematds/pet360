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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Calculator,
  Receipt
} from 'lucide-react';

export default function FinanceiroPage() {
  const [showCashOperation, setShowCashOperation] = useState(false);
  const [operationType, setOperationType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'CASH',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dashboardResponse, isLoading } = useQuery({
    queryKey: ['finance-dashboard'],
    queryFn: async () => {
      const response = await api.get('/finance/dashboard');
      return response.data;
    },
  });

  const dashboard = dashboardResponse?.data || dashboardResponse || {};

  const { data: transactionsResponse } = useQuery({
    queryKey: ['finance-transactions'],
    queryFn: async () => {
      const response = await api.get('/finance/cash-register');
      return response.data;
    },
  });

  const transactions = transactionsResponse?.data || [];

  const cashMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/finance/cash-register', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['finance-transactions'] });
      toast({ title: 'Lancamento registrado com sucesso!' });
      setShowCashOperation(false);
      setFormData({ amount: '', description: '', category: '', paymentMethod: 'CASH' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao registrar lancamento',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cashMutation.mutate({
      type: operationType,
      amount: parseFloat(formData.amount) || 0,
      description: formData.description,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
    });
  };

  const totalIncome = dashboard.totalIncome || dashboard.income || 0;
  const totalExpense = dashboard.totalExpense || dashboard.expenses || 0;
  const balance = dashboard.balance || (totalIncome - totalExpense);
  const pendingReceivables = dashboard.pendingReceivables || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-gray-600">Controle de caixa e financas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => { setOperationType('EXPENSE'); setShowCashOperation(true); }}
          >
            <ArrowDownCircle className="h-4 w-4 mr-2 text-red-600" />
            Saida
          </Button>
          <Button onClick={() => { setOperationType('INCOME'); setShowCashOperation(true); }}>
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Entrada
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Receitas</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(totalIncome))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Despesas</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(Number(totalExpense))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(Number(balance))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">A Receber</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(Number(pendingReceivables))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showCashOperation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {operationType === 'INCOME' ? (
                <>
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  Registrar Entrada
                </>
              ) : (
                <>
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  Registrar Saida
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Valor *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CASH">Dinheiro</option>
                  <option value="CREDIT_CARD">Cartao Credito</option>
                  <option value="DEBIT_CARD">Cartao Debito</option>
                  <option value="PIX">PIX</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder={operationType === 'INCOME' ? 'Ex: Servicos, Vendas' : 'Ex: Fornecedores, Aluguel'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descricao *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descricao do lancamento"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCashOperation(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={cashMutation.isPending}>
                  {cashMutation.isPending ? 'Salvando...' : 'Registrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Ultimos Lancamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : transactions?.length === 0 ? (
            <div className="py-8 text-center">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum lancamento encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions?.slice(0, 10).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.category && `${transaction.category} • `}
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(Number(transaction.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
