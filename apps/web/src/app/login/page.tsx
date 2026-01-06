'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, loginWithOtp, requestOtp } = useAuth();
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({ title: 'Login realizado com sucesso!' });
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.response?.data?.message || 'Verifique suas credenciais',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setIsLoading(true);
    try {
      await requestOtp(phone);
      setOtpSent(true);
      toast({ title: 'Codigo enviado!', description: 'Verifique seu WhatsApp' });
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar codigo',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithOtp(phone, otp);
      toast({ title: 'Login realizado com sucesso!' });
    } catch (error: any) {
      toast({
        title: 'Codigo invalido',
        description: error.response?.data?.message || 'Verifique o codigo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Entrar no Pet360</CardTitle>
          <CardDescription>Acesse sua conta para gerenciar seu negocio</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login Method Tabs */}
          <div className="flex mb-6 border rounded-md">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-l-md ${
                loginMethod === 'email'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-r-md ${
                loginMethod === 'phone'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              WhatsApp
            </button>
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <form onSubmit={handleOtpLogin}>
                  <div>
                    <label className="block text-sm font-medium mb-1">Codigo</label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                    {isLoading ? 'Verificando...' : 'Verificar'}
                  </Button>
                </form>
              )}

              {!otpSent && (
                <Button
                  onClick={handleRequestOtp}
                  className="w-full"
                  disabled={isLoading || !phone}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Codigo'}
                </Button>
              )}

              {otpSent && (
                <button
                  onClick={() => setOtpSent(false)}
                  className="text-sm text-primary hover:underline block mx-auto"
                >
                  Alterar numero
                </button>
              )}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Nao tem conta?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
