import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PawPrint,
  Calendar,
  Stethoscope,
  Syringe,
  Home,
  ShoppingBag,
  MessageCircle,
  BarChart3,
  Shield,
  Clock,
  Users,
  Star,
  Check,
  ChevronRight,
  Heart,
  Sparkles,
  TrendingUp,
  Zap,
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Stethoscope,
    title: 'Prontuario Eletronico',
    description: 'Historico medico completo, prescricoes digitais e anexo de exames em um so lugar.',
    color: 'bg-blue-500',
  },
  {
    icon: Syringe,
    title: 'Carteira de Vacinas',
    description: 'Controle automatico de vacinas com alertas e lembretes via WhatsApp para tutores.',
    color: 'bg-green-500',
  },
  {
    icon: Calendar,
    title: 'Agenda Inteligente',
    description: 'Agendamento visual com confirmacao automatica e gestao de multiplos profissionais.',
    color: 'bg-purple-500',
  },
  {
    icon: Home,
    title: 'Hotel & Daycare',
    description: 'Check-in digital, updates diarios com fotos e controle completo de hospedagem.',
    color: 'bg-orange-500',
  },
  {
    icon: ShoppingBag,
    title: 'Vendas & Estoque',
    description: 'PDV integrado, controle de estoque automatico e alertas de produtos acabando.',
    color: 'bg-pink-500',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Business',
    description: 'Integracao nativa para lembretes, confirmacoes e comunicacao com clientes.',
    color: 'bg-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Completo',
    description: 'Metricas em tempo real, relatorios de faturamento e insights do negocio.',
    color: 'bg-indigo-500',
  },
  {
    icon: Shield,
    title: 'Seguro & Confiavel',
    description: 'Dados isolados por negocio, backups automaticos e criptografia de ponta.',
    color: 'bg-red-500',
  },
];

const stats = [
  { value: '500+', label: 'Negocios Ativos' },
  { value: '50k+', label: 'Pets Cadastrados' },
  { value: '100k+', label: 'Agendamentos/Mes' },
  { value: '99.9%', label: 'Uptime Garantido' },
];

const testimonials = [
  {
    name: 'Dra. Marina Silva',
    role: 'Clinica VetCare',
    avatar: 'MS',
    content: 'O Pet360 transformou nossa clinica. Antes perdiamos tempo com papel, agora tudo e digital e os tutores adoram receber as vacinas pelo WhatsApp!',
    rating: 5,
  },
  {
    name: 'Ricardo Almeida',
    role: 'Pet Shop Amigo Fiel',
    avatar: 'RA',
    content: 'Controle de estoque perfeito! Nunca mais fiquei sem racao para vender. O sistema avisa quando esta acabando.',
    rating: 5,
  },
  {
    name: 'Carla Mendes',
    role: 'Hotel Pet Paradise',
    avatar: 'CM',
    content: 'Os tutores ficam tranquilos porque mandam updates diarios com foto. A taxa de retorno aumentou 40% desde que usamos o Pet360.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Gratis',
    description: 'Para quem esta comecando',
    features: [
      'Ate 50 pets cadastrados',
      'Agendamentos ilimitados',
      'Prontuario basico',
      '1 usuario',
      'Suporte por email',
    ],
    cta: 'Comecar Gratis',
    highlighted: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 149',
    period: '/mes',
    description: 'Para negocios em crescimento',
    features: [
      'Pets ilimitados',
      'Todos os modulos',
      'WhatsApp integrado',
      'Ate 5 usuarios',
      'Relatorios avancados',
      'Suporte prioritario',
    ],
    cta: 'Testar 14 dias gratis',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Sob consulta',
    description: 'Para redes e franquias',
    features: [
      'Multi-unidades',
      'API personalizada',
      'Usuarios ilimitados',
      'Integracao ERP',
      'Gerente de conta',
      'SLA garantido',
    ],
    cta: 'Falar com Vendas',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Preciso instalar algum software?',
    answer: 'Nao! O Pet360 funciona 100% na nuvem. Basta acessar pelo navegador de qualquer dispositivo - computador, tablet ou celular.',
  },
  {
    question: 'Meus dados estao seguros?',
    answer: 'Absolutamente. Utilizamos criptografia de ponta, servidores seguros e backups automaticos diarios. Seus dados sao completamente isolados de outros negocios.',
  },
  {
    question: 'Como funciona a integracao com WhatsApp?',
    answer: 'Voce conecta seu WhatsApp Business escaneando um QR Code. Depois disso, o sistema envia automaticamente lembretes de agendamentos, vacinas e muito mais.',
  },
  {
    question: 'Posso migrar meus dados de outro sistema?',
    answer: 'Sim! Nossa equipe ajuda na migracao de dados de planilhas ou outros sistemas. O processo e rapido e sem dor de cabeca.',
  },
  {
    question: 'Tem contrato de fidelidade?',
    answer: 'Nao. Voce pode cancelar a qualquer momento. Acreditamos que voce fica porque gosta, nao porque esta preso.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto py-4 px-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-xl p-2">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Pet360
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
                Recursos
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary transition-colors">
                Precos
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary transition-colors">
                Depoimentos
              </a>
              <a href="#faq" className="text-gray-600 hover:text-primary transition-colors">
                FAQ
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity">
                  Comecar Gratis
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Banner */}
      <section className="relative pt-24 overflow-hidden">
        {/* Hero Banner Image */}
        <div className="relative w-full">
          <Image
            src="/images/hero-banner-2.jpg"
            alt="Pet360 - Sistema Completo de Gestao para Negocios Pet"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
            priority
          />
          {/* Overlay with CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Plataforma #1 para Negocios Pet</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Sistema Completo de Gestao Pet
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow">
                  Clinicas veterinarias, pet shops, hoteis e daycares em uma unica plataforma.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 h-auto shadow-lg">
                      <Zap className="h-5 w-5 mr-2" />
                      Comecar Gratis
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto">
                      Conhecer Recursos
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Setup em 5 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>Sem cartao de credito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Banner Section */}
      <section id="demo" className="relative overflow-hidden">
        <div className="relative w-full">
          <Image
            src="/images/hero-banner-1.jpg"
            alt="Pet360 - Todas as funcionalidades"
            width={1920}
            height={1080}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Recursos Poderosos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tudo que voce precisa em um so lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas completas para gerenciar cada aspecto do seu negocio pet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Para todo tipo de negocio pet
            </h2>
            <p className="text-xl text-gray-600">
              Uma plataforma, multiplas possibilidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Stethoscope, label: 'Clinica Veterinaria', color: 'blue' },
              { icon: ShoppingBag, label: 'Pet Shop', color: 'pink' },
              { icon: Sparkles, label: 'Banho e Tosa', color: 'purple' },
              { icon: Home, label: 'Hotel Pet', color: 'orange' },
              { icon: Users, label: 'Daycare', color: 'green' },
              { icon: Heart, label: 'Centro de Adocao', color: 'red' },
            ].map((type, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`aspect-square rounded-2xl bg-${type.color}-50 flex flex-col items-center justify-center p-6 group-hover:bg-${type.color}-100 transition-colors`}>
                  <type.icon className={`h-12 w-12 text-${type.color}-600 mb-4`} />
                  <span className="text-sm font-medium text-gray-700 text-center">{type.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-primary to-blue-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Amado por Negocios Pet
            </h2>
            <p className="text-xl text-blue-100">
              Veja o que nossos clientes falam sobre o Pet360
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array(testimonial.rating).fill(0).map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-blue-200 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Precos Simples</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Escolha seu plano ideal
            </h2>
            <p className="text-xl text-gray-600">
              Comece gratis e escale conforme seu negocio cresce
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.highlighted ? 'border-primary shadow-xl scale-105' : 'border-gray-200'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-500">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/register">
                    <Button className={`w-full ${plan.highlighted ? 'bg-primary' : ''}`} variant={plan.highlighted ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que voce precisa saber para comecar
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center gap-3">
                    <ChevronRight className="h-5 w-5 text-primary" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-12 text-gray-600">
                  {faq.answer}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-primary to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para Transformar seu Negocio?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de estabelecimentos que ja usam Pet360 para crescer
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 h-auto">
              <Zap className="h-5 w-5 mr-2" />
              Comecar Gratis Agora
            </Button>
          </Link>
          <p className="mt-6 text-blue-200 text-sm">
            Nao precisa de cartao de credito • Setup em 5 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary rounded-xl p-2">
                  <PawPrint className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Pet360</span>
              </div>
              <p className="text-gray-400 mb-6">
                A plataforma completa para gestao de negocios pet.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Precos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integracao WhatsApp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parceiros</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@pet360.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Sao Paulo, Brasil</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              2024 Pet360. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
