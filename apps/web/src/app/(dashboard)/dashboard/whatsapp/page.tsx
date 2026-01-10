'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Send,
  QrCode,
  CheckCircle,
  XCircle,
  Phone,
  RefreshCw,
  Settings,
  X,
  PawPrint,
  Smartphone,
  Zap,
} from 'lucide-react';

export default function WhatsappPage() {
  const [showSendForm, setShowSendForm] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    message: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statusResponse, isLoading: loadingStatus } = useQuery({
    queryKey: ['whatsapp-status'],
    queryFn: async () => {
      const response = await api.get('/whatsapp/system/setup');
      return response.data;
    },
    refetchInterval: 10000,
  });

  const status = statusResponse?.data || statusResponse || {};
  const isConnected = status.connected || status.status === 'connected';

  const { data: qrResponse, isLoading: loadingQr } = useQuery({
    queryKey: ['whatsapp-qrcode'],
    queryFn: async () => {
      const response = await api.get('/whatsapp/qrcode');
      return response.data;
    },
    enabled: !isConnected,
    refetchInterval: 5000,
  });

  const qrCode = qrResponse?.data?.qrcode || qrResponse?.qrcode || null;

  const sendMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/whatsapp/send', {
        phone: data.phone.replace(/\D/g, ''),
        message: data.message,
      });
      return response.data;
    },
    onSuccess: () => {
      toast({ title: 'Mensagem enviada com sucesso!' });
      setFormData({ phone: '', message: '' });
      setShowSendForm(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/whatsapp/system/setup');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-status'] });
      queryClient.invalidateQueries({ queryKey: ['whatsapp-qrcode'] });
      toast({ title: 'Iniciando conexao...' });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao iniciar',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header com Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 p-6 text-white">
        <div className="absolute right-0 top-0 opacity-10">
          <MessageSquare className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-5 w-5" />
              <span className="text-green-100 text-sm font-medium">Integracao</span>
            </div>
            <h1 className="text-2xl font-bold">WhatsApp</h1>
            <p className="text-green-100 text-sm mt-1">
              Comunicacao direta com seus clientes
            </p>
          </div>
          {isConnected && (
            <Button
              onClick={() => setShowSendForm(true)}
              className="bg-white text-green-600 hover:bg-green-50 shadow-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          )}
        </div>
      </div>

      {/* Status Card */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${isConnected ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'}`} />
        <CardHeader className={`border-b ${isConnected ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-red-50 to-rose-50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
              <MessageSquare className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <CardTitle>Status da Conexao</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loadingStatus ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-200 border-t-green-600"></div>
                <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
              </div>
              <p className="mt-3 text-gray-500 text-sm">Verificando conexao...</p>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                {isConnected ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold text-lg ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </p>
                <p className="text-sm text-gray-600">
                  {isConnected
                    ? 'WhatsApp esta pronto para enviar mensagens'
                    : 'Escaneie o QR Code para conectar'}
                </p>
              </div>
              {!isConnected && (
                <Button
                  variant="outline"
                  onClick={() => setupMutation.mutate()}
                  disabled={setupMutation.isPending}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${setupMutation.isPending ? 'animate-spin' : ''}`} />
                  Reconectar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Card - Show when not connected */}
      {!isConnected && (
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <QrCode className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle>QR Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {loadingQr ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
                  <PawPrint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                </div>
                <p className="mt-4 text-gray-500">Gerando QR Code...</p>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center">
                <div className="p-6 bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-6">
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <div className="bg-green-50 rounded-xl p-4 max-w-md">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Como conectar:</p>
                      <ol className="list-decimal list-inside space-y-1 text-green-700">
                        <li>Abra o WhatsApp no seu celular</li>
                        <li>Va em Configuracoes &gt; Dispositivos Conectados</li>
                        <li>Toque em Conectar Dispositivo</li>
                        <li>Escaneie este codigo QR</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <QrCode className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">QR Code nao disponivel</h3>
                <p className="text-gray-500 mb-4">Clique no botao abaixo para iniciar a conexao</p>
                <Button
                  onClick={() => setupMutation.mutate()}
                  disabled={setupMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Iniciar Conexao
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Send Message Form */}
      {showSendForm && isConnected && (
        <Card className="border-0 shadow-card overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Send className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle>Enviar Mensagem</CardTitle>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setShowSendForm(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Telefone *</label>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 55 11 99999-9999"
                    className="h-11"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Inclua o codigo do pais (55 para Brasil)
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mensagem *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Digite sua mensagem..."
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setShowSendForm(false)} className="px-6">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {sendMutation.isPending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <Card className="border-0 shadow-card bg-gradient-to-r from-green-50 to-emerald-50 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Funcionalidades WhatsApp</p>
              <ul className="text-sm text-green-700 mt-2 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Envio de lembretes de agendamentos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Notificacao de vacinas proximas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Confirmacao de reservas de hospedagem
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Comunicacao direta com tutores
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
