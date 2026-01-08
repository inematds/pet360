'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Dog, Cat, Bird, Car, Home, Check, ArrowLeft, ArrowRight } from 'lucide-react';

const speciesOptions = [
  { value: 'DOG', label: 'Cachorros', icon: Dog },
  { value: 'CAT', label: 'Gatos', icon: Cat },
  { value: 'BIRD', label: 'Aves', icon: Bird },
  { value: 'RODENT', label: 'Roedores', icon: Dog },
  { value: 'REPTILE', label: 'Repteis', icon: Dog },
  { value: 'OTHER', label: 'Outros', icon: Dog },
];

const sizeOptions = [
  { value: 'MINI', label: 'Mini (ate 3kg)' },
  { value: 'SMALL', label: 'Pequeno (3-10kg)' },
  { value: 'MEDIUM', label: 'Medio (10-25kg)' },
  { value: 'LARGE', label: 'Grande (25-45kg)' },
  { value: 'GIANT', label: 'Gigante (45kg+)' },
];

const statesOptions = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export default function CadastroPetSitterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    name: '',
    email: '',
    phone: '',
    cpf: '',
    // Step 2: Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    serviceRadius: 10,
    // Step 3: Pet Experience
    bio: '',
    experience: '',
    acceptedSpecies: [] as string[],
    acceptedSizes: [] as string[],
    hasOwnTransport: false,
    hasYard: false,
    hasOtherPets: false,
    otherPetsDetails: '',
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/pet-sitters/register', data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Cadastro enviado com sucesso!',
        description: 'Analisaremos seu cadastro e entraremos em contato em breve.',
      });
      router.push('/pet-sitters');
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no cadastro',
        description: error.response?.data?.message || 'Tente novamente',
        variant: 'destructive',
      });
    },
  });

  const handleSpeciesToggle = (species: string) => {
    setFormData((prev) => ({
      ...prev,
      acceptedSpecies: prev.acceptedSpecies.includes(species)
        ? prev.acceptedSpecies.filter((s) => s !== species)
        : [...prev.acceptedSpecies, species],
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      acceptedSizes: prev.acceptedSizes.includes(size)
        ? prev.acceptedSizes.filter((s) => s !== size)
        : [...prev.acceptedSizes, size],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      registerMutation.mutate(formData);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.cpf;
      case 2:
        return formData.city && formData.state;
      case 3:
        return formData.acceptedSpecies.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <Link href="/pet-sitters" className="text-2xl font-bold text-primary">
              Pet360 Cuidadores
            </Link>
            <Link href="/pet-sitters" className="text-gray-600 hover:text-primary">
              Voltar
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Seja um Cuidador Pet360</CardTitle>
            <CardDescription>
              Cadastre-se e comece a ganhar dinheiro cuidando de pets
            </CardDescription>

            {/* Progress Steps */}
            <div className="flex justify-center gap-2 mt-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-16 h-2 rounded-full ${
                    s <= step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Etapa {step} de {totalSteps}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados Pessoais</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">Nome completo *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">WhatsApp *</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">CPF *</label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Endereco</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">Endereco</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, numero, complemento"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Cidade *</label>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Sao Paulo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Estado *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Selecione</option>
                        {statesOptions.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">CEP</label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Raio de atendimento (km)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={formData.serviceRadius}
                      onChange={(e) => setFormData({ ...formData, serviceRadius: Number(e.target.value) })}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Distancia maxima que voce atende a partir do seu endereco
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Pet Experience */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg">Experiencia com Pets</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sobre voce</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre voce e sua paixao por animais..."
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Experiencia</label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Descreva sua experiencia cuidando de animais..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quais tipos de animais voce cuida? *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {speciesOptions.map((species) => {
                        const Icon = species.icon;
                        const isSelected = formData.acceptedSpecies.includes(species.value);
                        return (
                          <button
                            key={species.value}
                            type="button"
                            onClick={() => handleSpeciesToggle(species.value)}
                            className={`p-3 rounded-lg border text-sm flex flex-col items-center gap-1 transition-colors ${
                              isSelected
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-gray-200 hover:border-primary'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            {species.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Quais portes voce aceita?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map((size) => {
                        const isSelected = formData.acceptedSizes.includes(size.value);
                        return (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => handleSizeToggle(size.value)}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                              isSelected
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white border-gray-200 hover:border-primary'
                            }`}
                          >
                            {size.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Diferenciais</label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.hasOwnTransport}
                        onChange={(e) => setFormData({ ...formData, hasOwnTransport: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Car className="h-5 w-5 text-gray-500" />
                      <span>Tenho transporte proprio</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.hasYard}
                        onChange={(e) => setFormData({ ...formData, hasYard: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Home className="h-5 w-5 text-gray-500" />
                      <span>Tenho quintal/area externa</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.hasOtherPets}
                        onChange={(e) => setFormData({ ...formData, hasOtherPets: e.target.checked })}
                        className="h-4 w-4"
                      />
                      <Dog className="h-5 w-5 text-gray-500" />
                      <span>Tenho outros pets em casa</span>
                    </label>

                    {formData.hasOtherPets && (
                      <Input
                        value={formData.otherPetsDetails}
                        onChange={(e) => setFormData({ ...formData, otherPetsDetails: e.target.value })}
                        placeholder="Descreva seus pets (ex: 2 gatos castrados)"
                        className="ml-8"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                ) : (
                  <div />
                )}

                <Button type="submit" disabled={!canProceed() || registerMutation.isPending}>
                  {step < totalSteps ? (
                    <>
                      Proximo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : registerMutation.isPending ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Finalizar Cadastro
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Como funciona?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Preencha o cadastro com seus dados</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Nossa equipe analisara seu perfil em ate 48 horas</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Apos aprovado, configure seus servicos e precos</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Comece a receber solicitacoes de tutores</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
