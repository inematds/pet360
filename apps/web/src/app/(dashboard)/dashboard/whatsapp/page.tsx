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
  Settings
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
    refetchInterval: 10000, // Refresh every 10 seconds
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
    refetchInterval: 5000, // Refresh QR every 5 seconds when not connected
  });

  const qrCode = qrResponse?.data?.qrcode || qrResponse?.qrcode || null;

  const sendMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/whatsapp/send', {
        phone: data.phone.replace(/\D/g, ''), // Remove non-digits
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp</h1>
          <p className="text-gray-600">Integracao com WhatsApp Business</p>
        </div>
        {isConnected && (
          <Button onClick={() => setShowSendForm(true)}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </Button>
        )}
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Status da Conexao
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStatus ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                {isConnected ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-lg">
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
                  size="sm"
                  className="ml-auto"
                  onClick={() => setupMutation.mutate()}
                  disabled={setupMutation.isPending}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingQr ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : qrCode ? (
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-lg shadow-inner mb-4">
                  <img
                    src={qrCode}
                    alt="WhatsApp QR Code"
                    className="w-64 h-64"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center max-w-md">
                  Abra o WhatsApp no seu celular, va em Configuracoes &gt; Dispositivos Conectados &gt; Conectar Dispositivo
                  e escaneie este codigo.
                </p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <QrCode className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">QR Code nao disponivel</p>
                <Button
                  onClick={() => setupMutation.mutate()}
                  disabled={setupMutation.isPending}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Telefone *</label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex: 55 11 99999-9999"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inclua o codigo do pais (55 para Brasil)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mensagem *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Digite sua mensagem..."
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowSendForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={sendMutation.isPending}>
                  {sendMutation.isPending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <p className="font-medium text-green-900">Funcionalidades WhatsApp</p>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Envio de lembretes de agendamentos</li>
                <li>• Notificacao de vacinas proximas</li>
                <li>• Confirmacao de reservas de hospedagem</li>
                <li>• Comunicacao direta com tutores</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
