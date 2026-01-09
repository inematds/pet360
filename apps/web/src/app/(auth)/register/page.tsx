'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const businessTypeOptions = [
  { value: 'PET_SHOP', label: 'Pet Shop' },
  { value: 'VET_CLINIC', label: 'Clinica Veterinaria' },
  { value: 'GROOMING', label: 'Banho e Tosa' },
  { value: 'HOTEL', label: 'Hotel Pet' },
  { value: 'DAYCARE', label: 'Daycare / Creche' },
  { value: 'ADOPTION_CENTER', label: 'Centro de Adocao' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    cnpj: '',
    businessPhone: '',
    businessEmail: '',
    businessTypes: [] as string[],
    userName: '',
    userEmail: '',
    userPhone: '',
    password: '',
    confirmPassword: '',
  });

  const router = useRouter();
  const { toast } = useToast();

  const handleBusinessTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      businessTypes: prev.businessTypes.includes(type)
        ? prev.businessTypes.filter(t => t !== type)
        : [...prev.businessTypes, type]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'As senhas nao conferem', variant: 'destructive' });
      return;
    }

    if (formData.businessTypes.length === 0) {
      toast({ title: 'Selecione pelo menos um tipo de negocio', variant: 'destructive' });
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/register', {
        businessName: formData.businessName,
        cnpj: formData.cnpj || undefined,
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail || undefined,
        businessTypes: formData.businessTypes,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        password: formData.password,
      });

      toast({ title: 'Conta criada com sucesso!' });
      router.push('/login?registered=true');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar conta',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold text-primary mb-2 block">Pet360</Link>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            {step === 1 ? 'Dados do seu negocio' : 'Seus dados de acesso'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Negocio *</label>
                  <Input
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Ex: Pet Shop Feliz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">CNPJ (opcional)</label>
                  <Input
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Telefone do Negocio *</label>
                  <Input
                    value={formData.businessPhone}
                    onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email do Negocio (opcional)</label>
                  <Input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                    placeholder="contato@seunegocio.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Negocio *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {businessTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleBusinessTypeToggle(option.value)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          formData.businessTypes.includes(option.value)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    if (!formData.businessName || !formData.businessPhone || formData.businessTypes.length === 0) {
                      toast({ title: 'Preencha todos os campos obrigatorios', variant: 'destructive' });
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Continuar
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Seu Nome *</label>
                  <Input
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seu Email *</label>
                  <Input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seu Telefone *</label>
                  <Input
                    value={formData.userPhone}
                    onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Senha *</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimo 6 caracteres"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Confirmar Senha *</label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Conta'}
                  </Button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Ja tem uma conta? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
