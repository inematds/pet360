import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">Pet360</div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button>Comece Gratis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema Completo para seu Negocio Pet
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gerencie clinicas veterinarias, petshops, hoteis e daycares em uma unica plataforma.
          Agendamentos, prontuarios, estoque, financeiro e muito mais.
        </p>
        <div className="space-x-4">
          <Link href="/register">
            <Button size="lg">Comecar Agora</Button>
          </Link>
          <Link href="/marketplace">
            <Button variant="outline" size="lg">Ver Marketplace</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recursos Completos</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Clinica Veterinaria</CardTitle>
              <CardDescription>Gestao completa de consultas e prontuarios</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Prontuario eletronico completo</li>
                <li>- Carteira de vacinas digital</li>
                <li>- Prescricoes e receituarios</li>
                <li>- Historico medico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Petshop & Banho</CardTitle>
              <CardDescription>Agendamentos e vendas integrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Agenda visual por profissional</li>
                <li>- Controle de estoque</li>
                <li>- PDV integrado</li>
                <li>- Comissoes automaticas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hotel & Daycare</CardTitle>
              <CardDescription>Hospedagem e creche para pets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Reservas e check-in/out</li>
                <li>- Updates diarios para tutores</li>
                <li>- Controle de alimentacao</li>
                <li>- Camera ao vivo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Integrado</CardTitle>
              <CardDescription>Comunicacao automatizada</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Lembretes automaticos</li>
                <li>- Confirmacao de agendamentos</li>
                <li>- Carteira de vacinas por WhatsApp</li>
                <li>- Campanhas de marketing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>Venda produtos e racoes</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Catalogo de produtos</li>
                <li>- Gestao de pedidos</li>
                <li>- Avaliacoes e reviews</li>
                <li>- Entrega integrada</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pet Sitters</CardTitle>
              <CardDescription>Cuidadores de pets</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>- Passeios e hospedagem</li>
                <li>- Perfis verificados</li>
                <li>- Avaliacoes de clientes</li>
                <li>- Pagamentos seguros</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para Transformar seu Negocio?</h2>
          <p className="text-lg mb-8 opacity-90">
            Junte-se a centenas de estabelecimentos que ja usam Pet360
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">Criar Conta Gratis</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-8 px-4 text-center text-gray-600">
        <p>2024 Pet360. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
