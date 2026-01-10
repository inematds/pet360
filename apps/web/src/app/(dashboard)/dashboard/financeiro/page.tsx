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
  Receipt,
  X,
  PawPrint,
  PiggyBank,
  Clock,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react';

const paymentMethodLabels: Record<string, string> = {
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartao Credito',
  DEBIT_CARD: 'Cartao Debito',
  PIX: 'PIX',
  TRANSFER: 'Transferencia',
};

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

  const stats = [
    {
      label: 'Receitas',
      value: totalIncome,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
    },
    {
      label: 'Despesas',
      value: totalExpense,
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-600',
      textColor: 'text-red-600',
    },
    {
      label: 'Saldo',
      value: balance,
      icon: Wallet,
      gradient: 'from-blue-500 to-indigo-600',
      textColor: balance >= 0 ? 'text-blue-600' : 'text-red-600',
    },
    {
      label: 'A Receber',
      value: pendingReceivables,
      icon: Clock,
      gradient: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-teal-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <PiggyBank className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-5 w-5" />
              <span className="text-teal-100 text-sm font-medium">Controle de Caixa</span>
            </div>
            <h1 className="text-2xl font-bold">Financeiro</h1>
            <p className="text-teal-100 text-sm mt-1">
              Gestao de receitas e despesas
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => { setOperationType('EXPENSE'); setShowCashOperation(true); }}
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
            >
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Saida
            </Button>
            <Button
              onClick={() => { setOperationType('INCOME'); setShowCashOperation(true); }}
              className="bg-white text-teal-600 hover:bg-teal-50 shadow-lg"
            >
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Entrada
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-card overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-gradient-to-br ${stat.gradient} rounded-xl`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.textColor}`}>
                    {formatCurrency(Number(stat.value))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario de Lancamento */}
      {showCashOperation && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className={`border-b ${operationType === 'INCOME' ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-rose-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${operationType === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {operationType === 'INCOME' ? (
                    <ArrowUpCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <CardTitle>
                  {operationType === 'INCOME' ? 'Registrar Entrada' : 'Registrar Saida'}
                </CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowCashOperation(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valor *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Forma de Pagamento</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={`flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 ${operationType === 'INCOME' ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                >
                  <option value="CASH">Dinheiro</option>
                  <option value="CREDIT_CARD">Cartao de Credito</option>
                  <option value="DEBIT_CARD">Cartao de Debito</option>
                  <option value="PIX">PIX</option>
                  <option value="TRANSFER">Transferencia</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder={operationType === 'INCOME' ? 'Ex: Servicos, Vendas' : 'Ex: Fornecedores, Aluguel'}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Descricao *</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descricao do lancamento"
                  className="h-11"
                  required
                />
              </div>
              <div className="md:col-span-2 flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowCashOperation(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={cashMutation.isPending}
                  className={`px-6 ${operationType === 'INCOME' ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'}`}
                >
                  {cashMutation.isPending ? 'Salvando...' : 'Registrar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ultimos Lancamentos */}
      <Card className="border-0 shadow-card">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-xl">
              <Receipt className="h-5 w-5 text-teal-600" />
            </div>
            <CardTitle>Ultimos Lancamentos</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600"></div>
                <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-teal-600" />
              </div>
              <p className="mt-4 text-gray-500">Carregando lancamentos...</p>
            </div>
          ) : transactions?.length === 0 ? (
            <div className="py-16 text-center">
              <div className="p-4 bg-teal-50 rounded-full w-fit mx-auto mb-4">
                <Calculator className="h-10 w-10 text-teal-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Nenhum lancamento encontrado</h3>
              <p className="text-gray-500">
                Registre entradas e saidas para acompanhar o fluxo de caixa
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions?.slice(0, 10).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {transaction.category && (
                          <>
                            <span className="px-1.5 py-0.5 bg-gray-100 rounded">{transaction.category}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod}</span>
                        <span>•</span>
                        <span>{formatDate(transaction.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
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
