# Orientacao para Redesign Visual - Pet360

**Data:** 2026-01-09
**Contexto:** Orientacao do BMad Orchestrator sobre como abordar mudancas de layout/visual no projeto

---

## Objetivo

Dar acabamento visual ao projeto Pet360, mantendo toda a estrutura funcional e apenas refinando o layout/design.

---

## Agente Recomendado

**UX Expert** (`/ux-expert`) - Especialista em design de interface e experiencia do usuario.

---

## Preparacao Antes de Chamar o UX Expert

### 1. Referencias Visuais (Recomendado)

Passar exemplos ajuda muito! Pode ser:
- Screenshots de sites/apps que voce admira
- Links de templates ou temas
- Paleta de cores desejada
- Estilo geral (minimalista, moderno, corporativo, etc.)

### 2. Escopo Claro

Definir se quer:
- [ ] Apenas ajustes de cores/tipografia/espacamento
- [ ] Redesign completo mantendo estrutura
- [ ] Componentizacao com design system

### 3. Checklist de Preparacao

- [ ] 2-3 referencias visuais de sites que goste
- [ ] Definir se quer manter as cores atuais ou mudar
- [ ] Listar as paginas prioritarias para o acabamento

---

## O que o UX Expert Pode Entregar

1. **Guia de estilo visual** - cores, fontes, espacamentos
2. **Especificacoes de componentes** - botoes, cards, formularios
3. **Sugestoes de melhorias de UX/UI** - fluxos, usabilidade
4. **Prompt para ferramentas AI de frontend** - v0.dev, Lovable, etc.

---

## Abordagens Possiveis

| Opcao | Descricao |
|-------|-----------|
| **A** | Voce passa referencias → UX analisa → cria guia de estilo |
| **B** | UX analisa o projeto atual → sugere melhorias → voce aprova |
| **C** | Voce descreve o "feeling" desejado → UX propoe direcao visual |

---

## Paginas do Pet360 para Considerar

### Dashboard (Alta Prioridade)
- `/dashboard` - Pagina principal
- `/dashboard/tutores` - Gestao de tutores
- `/dashboard/pets` - Gestao de pets
- `/dashboard/agenda` - Agendamentos

### Modulos Funcionais
- `/dashboard/prontuarios` - Prontuarios medicos
- `/dashboard/vacinas` - Controle de vacinas
- `/dashboard/hospedagem` - Reservas de hospedagem
- `/dashboard/adocao` - Animais para adocao
- `/dashboard/produtos` - Gestao de produtos
- `/dashboard/vendas` - Registro de vendas
- `/dashboard/financeiro` - Controle financeiro
- `/dashboard/analytics` - Metricas e relatorios
- `/dashboard/whatsapp` - Integracao WhatsApp
- `/dashboard/configuracoes` - Configuracoes do sistema

### Paginas Publicas
- `/` - Home/Landing page
- `/login` - Pagina de login
- `/register` - Cadastro de novos negocios

---

## Como Iniciar o Redesign

```bash
# No Claude Code, chamar o agente UX:
/ux-expert

# Ou atraves do BMad Orchestrator:
/bmad-orchestrator
*agent ux-expert
```

---

## Notas

- O projeto usa **Tailwind CSS** e componentes **shadcn/ui**
- Framework: **Next.js 14** com App Router
- Componentes ja existentes em `/apps/web/src/components/ui/`
- Tema atual: cores primarias em azul, fundo claro
