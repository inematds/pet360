# Prompt de Instrucao: Sistema para Pet Shops e Clinicas Veterinarias

**Baseado no projeto Bela360**
**Data:** 05/01/2026

---

# PARTE 1: VISAO GERAL DO SISTEMA

## 1.1 Nome Sugerido: **Pet360** ou **PetCare**

## 1.2 Publico-Alvo

### Negocios que podem usar:
- Pet Shops
- Clinicas Veterinarias
- Hoteis para Pets (hospedagem)
- Creches para Pets (daycare)
- ONGs de Adocao
- Centros de Adocao Municipais
- Banho e Tosa
- Adestramento
- Pet Sitters

### Usuarios do sistema:
- **Donos do negocio** - Gestao completa
- **Veterinarios** - Prontuario, consultas
- **Atendentes** - Agendamentos, vendas
- **Tosadores/Banhistas** - Agenda propria
- **Tutores** - App/Portal do cliente
- **Adotantes** - Processo de adocao

---

## 1.3 Proposta de Valor

Sistema completo para gestao de negocios pet com:
- **Prontuario veterinario** digital
- **Carteira de vacinacao** com lembretes automaticos
- **Adocao de animais** com processo completo
- **Hospedagem/Hotel** para pets
- **Agendamento** de servicos (banho, tosa, consulta)
- **Loja/PDV** integrado
- **WhatsApp** para comunicacao
- **App do Tutor** para acompanhamento

---

# PARTE 2: MODULOS DO SISTEMA

## 2.1 Modulo: Cadastro de Pets

```
Dados do Pet:
- Nome
- Especie (cao, gato, passaro, roedor, reptil, outro)
- Raca
- Porte (mini, pequeno, medio, grande, gigante)
- Data de nascimento / idade estimada
- Sexo
- Cor/Pelagem
- Peso atual
- Castrado (sim/nao)
- Microchip (numero)
- Foto
- Caracteristicas especiais
- Temperamento
- Alergias conhecidas
- Restricoes alimentares

Vinculo:
- Tutor responsavel
- Tutores adicionais (familia)

Historico:
- Consultas
- Vacinas
- Cirurgias
- Internacoes
- Servicos (banho, tosa)
```

## 2.2 Modulo: Cadastro de Tutores (CRM)

```
Dados Pessoais:
- Nome completo
- CPF
- Email
- Telefone principal
- Telefone secundario
- WhatsApp

Endereco:
- CEP, Rua, Numero, Complemento
- Bairro, Cidade, Estado

Preferencias:
- Horarios preferidos
- Profissional preferido
- Forma de pagamento preferida
- Aceita SMS/WhatsApp

Financeiro:
- Total gasto
- Creditos/Debitos
- Historico de pagamentos

Pets vinculados:
- Lista de pets do tutor
```

## 2.3 Modulo: Prontuario Veterinario

```
Consulta:
- Data/Hora
- Veterinario responsavel
- Pet
- Tipo (rotina, emergencia, retorno)
- Peso no dia
- Temperatura
- Anamnese (queixa principal)
- Exame fisico
- Hipotese diagnostica
- Exames solicitados
- Prescricao medicamentosa
- Orientacoes
- Retorno recomendado

Anexos:
- Resultados de exames
- Imagens (raio-x, ultrassom)
- Laudos

Receituario:
- Medicamento
- Dosagem
- Frequencia
- Duracao
- Instrucoes especiais
- Receita controlada (sim/nao)
```

## 2.4 Modulo: Carteira de Vacinacao

```
Vacina aplicada:
- Pet
- Tipo de vacina (V8, V10, Antirrabica, Gripe, etc)
- Lote
- Fabricante
- Data de aplicacao
- Data de validade
- Veterinario responsavel
- Proxima dose

Lembretes automaticos:
- 30 dias antes do vencimento
- 7 dias antes
- No dia
- Apos vencimento

Carteira digital:
- QR Code para acesso
- PDF para download
- Compartilhar via WhatsApp
```

## 2.5 Modulo: Adocao de Animais

```
Animal para adocao:
- Dados basicos (nome, especie, raca, idade)
- Historia/Resgate
- Fotos e videos
- Estado de saude
- Vacinas em dia
- Castrado
- Comportamento
- Necessidades especiais
- Status (disponivel, em processo, adotado)

Processo de adocao:
1. Cadastro do interessado
2. Questionario de perfil
3. Analise do perfil
4. Entrevista (presencial ou video)
5. Visita ao animal
6. Visita domiciliar (opcional)
7. Termo de adocao
8. Entrega do animal
9. Acompanhamento pos-adocao

Termo de adocao:
- Dados do adotante
- Dados do animal
- Compromissos assumidos
- Assinatura digital
- Testemunhas

Acompanhamento:
- Contato em 7 dias
- Contato em 30 dias
- Contato em 90 dias
- Fotos de acompanhamento
```

## 2.6 Modulo: Hospedagem / Hotel Pet

```
Reserva:
- Pet(s)
- Tutor
- Check-in (data/hora)
- Check-out (data/hora)
- Tipo de acomodacao
- Diarias calculadas
- Alimentacao incluida
- Servicos adicionais (banho, passeio)
- Observacoes especiais
- Contato de emergencia

Acomodacoes:
- Nome/Numero
- Tipo (individual, compartilhado)
- Capacidade
- Porte aceito
- Preco diaria
- Status (livre, ocupado, manutencao)

Durante hospedagem:
- Alimentacao (horarios, quantidade)
- Medicacoes
- Passeios
- Fotos/Videos diarios
- Ocorrencias
- Comportamento

Diario do pet:
- Envio automatico ao tutor
- Fotos do dia
- Como passou a noite
- Alimentacao
- Atividades
```

## 2.7 Modulo: Creche / Daycare

```
Pacotes:
- Diaria avulsa
- Pacote semanal (5 dias)
- Pacote mensal
- Turno (manha, tarde, integral)

Atividades:
- Socializacao
- Brincadeiras
- Passeios
- Natacao (se disponivel)
- Descanso

Monitoramento:
- Cameras ao vivo (link para tutor)
- Fotos do dia
- Relatorio de comportamento
```

## 2.8 Modulo: Agendamento de Servicos

```
Servicos:
- Consulta veterinaria
- Vacina
- Banho
- Tosa
- Banho + Tosa
- Banho terapeutico
- Hidratacao
- Spa completo
- Cirurgia
- Exames
- Adestramento

Agenda:
- Calendario por profissional
- Bloqueio de horarios
- Duracao por servico
- Intervalo entre atendimentos

Confirmacao:
- WhatsApp automatico
- Lembrete 24h antes
- Lembrete 2h antes
- Confirmar presenca
```

## 2.9 Modulo: PDV / Loja

```
Produtos:
- Racao
- Petiscos
- Brinquedos
- Acessorios (coleiras, roupas)
- Higiene (shampoo, condicionador)
- Medicamentos
- Camas/Casas

Venda:
- Carrinho
- Multiplas formas pagamento
- Desconto
- Parcelamento
- Nota fiscal
- Delivery

Estoque:
- Controle por produto
- Estoque minimo
- Alerta de reposicao
- Validade de produtos
- Fornecedores
```

## 2.10 Modulo: Financeiro

```
Caixa:
- Abertura/Fechamento
- Entradas (servicos, produtos)
- Saidas (despesas)
- Sangria
- Reforco

Formas de pagamento:
- Dinheiro
- PIX
- Cartao credito
- Cartao debito
- Convenio/Fiado

Comissoes:
- Por profissional
- Por servico
- Percentual ou fixo

Relatorios:
- Faturamento diario/mensal
- Por servico
- Por profissional
- Ticket medio
- Produtos mais vendidos
```

## 2.11 Modulo: Marketing & Comunicacao

```
Campanhas:
- Aniversario do pet
- Vacina vencendo
- Tempo sem visita
- Promocoes

Segmentos:
- Tutores de caes
- Tutores de gatos
- Tutores VIP
- Inativos

Canais:
- WhatsApp
- SMS
- Email
- Push (app)
```

## 2.12 Modulo: App do Tutor

```
Funcionalidades:
- Ver pets cadastrados
- Carteira de vacinacao
- Historico de consultas
- Agendar servicos
- Acompanhar hospedagem (fotos)
- Ver cameras daycare
- Pagar servicos
- Chat com clinica
- Notificacoes de lembrete
```

---

# PARTE 3: SCHEMA DO BANCO DE DADOS (PRISMA)

```prisma
// ============================================
// ENUMS
// ============================================

enum Species {
  DOG
  CAT
  BIRD
  RODENT
  REPTILE
  FISH
  OTHER
}

enum PetSize {
  MINI        // Ate 3kg
  SMALL       // 3-10kg
  MEDIUM      // 10-25kg
  LARGE       // 25-45kg
  GIANT       // Acima 45kg
}

enum PetGender {
  MALE
  FEMALE
  UNKNOWN
}

enum AdoptionStatus {
  AVAILABLE
  IN_PROCESS
  ADOPTED
  RETURNED
  UNAVAILABLE
}

enum BoardingStatus {
  RESERVED
  CHECKED_IN
  CHECKED_OUT
  CANCELLED
  NO_SHOW
}

enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum AppointmentType {
  CONSULTATION      // Consulta
  VACCINE           // Vacina
  SURGERY           // Cirurgia
  EXAM              // Exame
  GROOMING          // Banho/Tosa
  RETURN            // Retorno
  EMERGENCY         // Emergencia
  TRAINING          // Adestramento
}

enum PaymentMethod {
  CASH
  PIX
  CREDIT_CARD
  DEBIT_CARD
  TRANSFER
  INSTALLMENT       // Fiado/Convenio
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  REFUNDED
  CANCELLED
}

enum VaccineType {
  V8
  V10
  RABIES           // Antirrabica
  GIARDIA
  FLU              // Gripe canina
  LEISHMANIASIS
  FELINE_TRIPLE    // Triplice felina
  FELINE_QUADRUPLE
  FELINE_LEUKEMIA  // Leucemia felina
  OTHER
}

enum StockMovementType {
  PURCHASE
  SALE
  SERVICE_USE
  ADJUSTMENT
  RETURN
  LOSS
  EXPIRED
}

enum RoomType {
  INDIVIDUAL
  SHARED
  SUITE
  ICU             // UTI
}

// ============================================
// CORE: NEGOCIO
// ============================================

model Business {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  cnpj            String?  @unique
  phone           String
  email           String?

  // Tipo de negocio
  businessTypes   String[] // PET_SHOP, VET_CLINIC, HOTEL, DAYCARE, ADOPTION_CENTER, GROOMING

  // Endereco
  address         String?
  city            String?
  state           String?
  zipCode         String?

  // WhatsApp
  whatsappInstanceId  String?
  whatsappConnected   Boolean @default(false)

  // Configuracoes
  settings        Json     @default("{}")

  // Horario de funcionamento
  openingHours    Json?    // {mon: {open: "08:00", close: "18:00"}, ...}

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  users           User[]
  tutors          Tutor[]
  pets            Pet[]
  services        Service[]
  appointments    Appointment[]
  adoptionAnimals AdoptionAnimal[]
  boardingRooms   BoardingRoom[]
  boardings       Boarding[]
  daycarePackages DaycarePackage[]
  products        Product[]
  sales           Sale[]
  cashRegisters   CashRegister[]
  vaccines        VaccineRecord[]
  medicalRecords  MedicalRecord[]
  campaigns       Campaign[]

  @@map("businesses")
}

model User {
  id              String   @id @default(cuid())
  businessId      String
  name            String
  email           String
  phone           String
  role            String   // OWNER, ADMIN, VET, GROOMER, ATTENDANT, TRAINER

  // Profissional
  crmv            String?  // Registro veterinario
  specialties     String[]
  color           String?  // Cor na agenda

  // Auth
  passwordHash    String?
  otpCode         String?
  otpExpiresAt    DateTime?
  isActive        Boolean  @default(true)

  // Comissao
  commissionRate  Decimal? @db.Decimal(5,2)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  appointments    Appointment[]
  medicalRecords  MedicalRecord[]
  vaccineRecords  VaccineRecord[]
  sales           Sale[]
  boardingUpdates BoardingUpdate[]

  @@unique([businessId, email])
  @@map("users")
}

// ============================================
// TUTORES E PETS
// ============================================

model Tutor {
  id              String   @id @default(cuid())
  businessId      String

  // Dados pessoais
  name            String
  cpf             String?
  email           String?
  phone           String
  phone2          String?

  // Endereco
  address         String?
  number          String?
  complement      String?
  neighborhood    String?
  city            String?
  state           String?
  zipCode         String?

  // Preferencias
  preferredContact String  @default("WHATSAPP") // WHATSAPP, SMS, EMAIL, PHONE
  preferredTime   String?  // MORNING, AFTERNOON, EVENING

  // Financeiro
  totalSpent      Decimal  @default(0) @db.Decimal(10,2)
  creditBalance   Decimal  @default(0) @db.Decimal(10,2)
  hasDebt         Boolean  @default(false)

  // Marketing
  acceptsMarketing Boolean @default(true)
  birthDate       DateTime?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  lastVisitAt     DateTime?

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  pets            Pet[]
  appointments    Appointment[]
  boardings       Boarding[]
  daycareEnrollments DaycareEnrollment[]
  sales           Sale[]
  adoptions       Adoption[]

  @@unique([businessId, cpf])
  @@index([businessId, phone])
  @@map("tutors")
}

model Pet {
  id              String   @id @default(cuid())
  businessId      String
  tutorId         String?  // Null para animais de adocao sem tutor

  // Identificacao
  name            String
  species         Species
  breed           String?
  size            PetSize?
  gender          PetGender @default(UNKNOWN)
  color           String?

  // Nascimento
  birthDate       DateTime?
  estimatedAge    String?  // "2 anos", "6 meses"

  // Caracteristicas
  weight          Decimal? @db.Decimal(5,2) // kg
  microchipNumber String?
  isNeutered      Boolean  @default(false)
  neuteredDate    DateTime?

  // Fotos
  photoUrl        String?
  photos          String[]

  // Saude
  allergies       String[]
  chronicConditions String[]
  dietaryRestrictions String?
  observations    String?

  // Comportamento
  temperament     String?  // CALM, ACTIVE, AGGRESSIVE, ANXIOUS, FRIENDLY
  socialization   String?  // Convive bem com outros animais?

  // Status
  isActive        Boolean  @default(true)
  isDeceased      Boolean  @default(false)
  deceasedDate    DateTime?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  tutor           Tutor?   @relation(fields: [tutorId], references: [id])
  appointments    Appointment[]
  vaccineRecords  VaccineRecord[]
  medicalRecords  MedicalRecord[]
  boardings       Boarding[]
  daycareEnrollments DaycareEnrollment[]
  adoptionProfile AdoptionAnimal?

  @@index([businessId])
  @@index([tutorId])
  @@map("pets")
}

// ============================================
// PRONTUARIO E VACINAS
// ============================================

model MedicalRecord {
  id              String   @id @default(cuid())
  businessId      String
  petId           String
  vetId           String
  appointmentId   String?

  // Data
  recordDate      DateTime @default(now())
  recordType      String   // CONSULTATION, EXAM, SURGERY, HOSPITALIZATION, RETURN

  // Exame fisico
  weight          Decimal? @db.Decimal(5,2)
  temperature     Decimal? @db.Decimal(4,1) // Celsius
  heartRate       Int?     // bpm
  respiratoryRate Int?     // rpm
  hydration       String?  // NORMAL, MILD, MODERATE, SEVERE
  bodyCondition   Int?     // 1-9 scale

  // Anamnese
  chiefComplaint  String?  // Queixa principal
  historyPresent  String?  // Historia da doenca atual
  physicalExam    String?  // Exame fisico detalhado

  // Diagnostico
  diagnosis       String?  // Hipotese diagnostica
  differentialDiagnosis String[] // Diagnosticos diferenciais

  // Conduta
  treatment       String?  // Tratamento instituido
  prescription    Json?    // Receita estruturada
  examsRequested  String[] // Exames solicitados
  procedures      String[] // Procedimentos realizados

  // Orientacoes
  instructions    String?  // Orientacoes ao tutor
  returnDate      DateTime? // Data de retorno
  prognosis       String?  // Prognostico

  // Anexos
  attachments     String[] // URLs de arquivos
  images          String[] // URLs de imagens (raio-x, etc)

  // Internacao
  isHospitalized  Boolean  @default(false)
  admissionDate   DateTime?
  dischargeDate   DateTime?
  hospitalizationNotes String?

  // Cirurgia
  isSurgical      Boolean  @default(false)
  surgeryType     String?
  anesthesiaType  String?
  surgeryNotes    String?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  pet             Pet      @relation(fields: [petId], references: [id])
  vet             User     @relation(fields: [vetId], references: [id])
  appointment     Appointment? @relation(fields: [appointmentId], references: [id])
  prescriptions   Prescription[]

  @@index([businessId])
  @@index([petId])
  @@index([vetId])
  @@map("medical_records")
}

model Prescription {
  id              String   @id @default(cuid())
  medicalRecordId String

  // Medicamento
  medication      String
  concentration   String?  // "500mg", "10mg/ml"
  form            String?  // Comprimido, liquido, injetavel

  // Posologia
  dosage          String   // "1 comprimido", "5ml"
  frequency       String   // "12/12h", "1x ao dia"
  duration        String   // "7 dias", "uso continuo"
  route           String?  // Oral, topico, injetavel

  // Instrucoes
  instructions    String?  // "Dar com comida"
  isControlled    Boolean  @default(false) // Receita controlada

  // Quantidade
  quantity        Int?     // Quantidade prescrita
  refills         Int      @default(0) // Repeticoes

  // Relations
  medicalRecord   MedicalRecord @relation(fields: [medicalRecordId], references: [id])

  @@map("prescriptions")
}

model VaccineRecord {
  id              String      @id @default(cuid())
  businessId      String
  petId           String
  vetId           String
  appointmentId   String?

  // Vacina
  vaccineType     VaccineType
  vaccineName     String      // Nome comercial
  manufacturer    String?
  batchNumber     String?     // Lote

  // Aplicacao
  applicationDate DateTime
  expirationDate  DateTime?   // Validade da vacina

  // Proxima dose
  nextDoseDate    DateTime?
  nextDoseType    VaccineType?

  // Lembretes
  reminderSent30d Boolean     @default(false)
  reminderSent7d  Boolean     @default(false)
  reminderSentDay Boolean     @default(false)

  // Reacoes
  hadReaction     Boolean     @default(false)
  reactionNotes   String?

  // Certificado
  certificateUrl  String?     // PDF da carteira

  // Timestamps
  createdAt       DateTime    @default(now())

  // Relations
  business        Business    @relation(fields: [businessId], references: [id])
  pet             Pet         @relation(fields: [petId], references: [id])
  vet             User        @relation(fields: [vetId], references: [id])
  appointment     Appointment? @relation(fields: [appointmentId], references: [id])

  @@index([businessId])
  @@index([petId])
  @@index([nextDoseDate])
  @@map("vaccine_records")
}

// ============================================
// ADOCAO
// ============================================

model AdoptionAnimal {
  id              String         @id @default(cuid())
  businessId      String
  petId           String         @unique

  // Historia
  rescueDate      DateTime?
  rescueLocation  String?
  rescueStory     String?
  previousOwner   String?

  // Status
  status          AdoptionStatus @default(AVAILABLE)
  availableDate   DateTime       @default(now())
  adoptedDate     DateTime?

  // Saude para adocao
  isVaccinated    Boolean        @default(false)
  isNeutered      Boolean        @default(false)
  isDewormed      Boolean        @default(false)
  healthNotes     String?

  // Comportamento
  goodWithKids    Boolean?
  goodWithDogs    Boolean?
  goodWithCats    Boolean?
  apartmentFriendly Boolean?
  energyLevel     String?        // LOW, MEDIUM, HIGH
  trainingLevel   String?        // NONE, BASIC, ADVANCED

  // Requisitos
  requirements    String?        // Requisitos para adocao
  adoptionFee     Decimal?       @db.Decimal(10,2)

  // Media
  videoUrl        String?
  description     String?        // Descricao para divulgacao

  // Publicacao
  isPublished     Boolean        @default(true)
  publishedOnSite Boolean        @default(true)
  featuredUntil   DateTime?

  // Stats
  viewCount       Int            @default(0)
  inquiryCount    Int            @default(0)

  // Timestamps
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations
  business        Business       @relation(fields: [businessId], references: [id])
  pet             Pet            @relation(fields: [petId], references: [id])
  adoptions       Adoption[]
  inquiries       AdoptionInquiry[]

  @@index([businessId, status])
  @@map("adoption_animals")
}

model AdoptionInquiry {
  id              String   @id @default(cuid())
  adoptionAnimalId String

  // Interessado
  name            String
  email           String?
  phone           String
  message         String?

  // Status
  status          String   @default("NEW") // NEW, CONTACTED, QUALIFIED, REJECTED, CONVERTED
  rejectionReason String?

  // Timestamps
  createdAt       DateTime @default(now())
  contactedAt     DateTime?

  // Relations
  adoptionAnimal  AdoptionAnimal @relation(fields: [adoptionAnimalId], references: [id])

  @@index([adoptionAnimalId])
  @@map("adoption_inquiries")
}

model Adoption {
  id              String   @id @default(cuid())
  adoptionAnimalId String
  tutorId         String

  // Processo
  applicationDate DateTime @default(now())
  interviewDate   DateTime?
  homeVisitDate   DateTime?
  adoptionDate    DateTime?

  // Questionario
  questionnaire   Json?    // Respostas do questionario

  // Status do processo
  stage           String   @default("APPLICATION") // APPLICATION, INTERVIEW, HOME_VISIT, APPROVED, COMPLETED, REJECTED
  stageNotes      String?

  // Termo de adocao
  agreementUrl    String?
  signedAt        DateTime?

  // Acompanhamento pos-adocao
  followUp7d      DateTime?
  followUp7dNotes String?
  followUp30d     DateTime?
  followUp30dNotes String?
  followUp90d     DateTime?
  followUp90dNotes String?

  // Devolucao (se houver)
  returnDate      DateTime?
  returnReason    String?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  adoptionAnimal  AdoptionAnimal @relation(fields: [adoptionAnimalId], references: [id])
  tutor           Tutor          @relation(fields: [tutorId], references: [id])

  @@index([adoptionAnimalId])
  @@index([tutorId])
  @@map("adoptions")
}

// ============================================
// HOSPEDAGEM / HOTEL
// ============================================

model BoardingRoom {
  id              String   @id @default(cuid())
  businessId      String

  // Identificacao
  name            String   // "Suite 1", "Quarto 5"
  code            String?

  // Tipo
  roomType        RoomType @default(INDIVIDUAL)
  acceptedSpecies Species[]
  acceptedSizes   PetSize[]

  // Capacidade
  capacity        Int      @default(1)

  // Preco
  dailyRate       Decimal  @db.Decimal(10,2)
  extraPetRate    Decimal? @db.Decimal(10,2)

  // Amenidades
  amenities       String[] // AC, TV, Camera, Cama, etc
  hasCamera       Boolean  @default(false)
  cameraUrl       String?

  // Status
  isActive        Boolean  @default(true)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business  @relation(fields: [businessId], references: [id])
  boardings       Boarding[]

  @@unique([businessId, name])
  @@map("boarding_rooms")
}

model Boarding {
  id              String         @id @default(cuid())
  businessId      String
  tutorId         String
  petId           String
  roomId          String

  // Datas
  checkInDate     DateTime
  checkInTime     String?        // HH:MM
  checkOutDate    DateTime
  checkOutTime    String?

  // Status
  status          BoardingStatus @default(RESERVED)
  actualCheckIn   DateTime?
  actualCheckOut  DateTime?

  // Valores
  dailyRate       Decimal        @db.Decimal(10,2)
  totalDays       Int
  subtotal        Decimal        @db.Decimal(10,2)
  extraServices   Decimal        @default(0) @db.Decimal(10,2)
  discount        Decimal        @default(0) @db.Decimal(10,2)
  totalAmount     Decimal        @db.Decimal(10,2)

  // Pagamento
  paymentStatus   PaymentStatus  @default(PENDING)
  paidAmount      Decimal        @default(0) @db.Decimal(10,2)

  // Informacoes do pet durante estadia
  feedingSchedule String?        // Horarios de alimentacao
  foodType        String?        // Tipo de racao
  foodAmount      String?        // Quantidade
  medications     Json?          // Medicacoes necessarias
  specialNeeds    String?        // Necessidades especiais

  // Contato emergencia
  emergencyContact String?
  emergencyPhone  String?

  // Veterinario autorizado
  vetName         String?
  vetPhone        String?

  // Observacoes
  notes           String?

  // Timestamps
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relations
  business        Business       @relation(fields: [businessId], references: [id])
  tutor           Tutor          @relation(fields: [tutorId], references: [id])
  pet             Pet            @relation(fields: [petId], references: [id])
  room            BoardingRoom   @relation(fields: [roomId], references: [id])
  updates         BoardingUpdate[]
  services        BoardingService[]

  @@index([businessId, status])
  @@index([roomId, checkInDate, checkOutDate])
  @@map("boardings")
}

model BoardingUpdate {
  id              String   @id @default(cuid())
  boardingId      String
  userId          String

  // Atualizacao
  updateType      String   // PHOTO, FEEDING, WALK, PLAY, MEDICATION, NOTE
  content         String?
  photos          String[]
  videoUrl        String?

  // Envio ao tutor
  sentToTutor     Boolean  @default(false)
  sentAt          DateTime?

  // Timestamps
  createdAt       DateTime @default(now())

  // Relations
  boarding        Boarding @relation(fields: [boardingId], references: [id])
  user            User     @relation(fields: [userId], references: [id])

  @@index([boardingId])
  @@map("boarding_updates")
}

model BoardingService {
  id              String   @id @default(cuid())
  boardingId      String

  // Servico
  serviceName     String   // Banho, Tosa, Passeio extra
  serviceDate     DateTime
  price           Decimal  @db.Decimal(10,2)

  // Status
  isCompleted     Boolean  @default(false)
  completedAt     DateTime?
  notes           String?

  // Relations
  boarding        Boarding @relation(fields: [boardingId], references: [id])

  @@map("boarding_services")
}

// ============================================
// DAYCARE / CRECHE
// ============================================

model DaycarePackage {
  id              String   @id @default(cuid())
  businessId      String

  // Pacote
  name            String   // "Diaria", "Pacote 10 dias", "Mensal"
  description     String?

  // Tipo
  packageType     String   // DAILY, WEEKLY, MONTHLY, CREDITS
  daysIncluded    Int?     // Numero de dias inclusos
  validityDays    Int?     // Validade em dias

  // Turnos
  shift           String   // MORNING, AFTERNOON, FULL_DAY

  // Preco
  price           Decimal  @db.Decimal(10,2)

  // Atividades incluidas
  activities      String[]

  // Status
  isActive        Boolean  @default(true)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  enrollments     DaycareEnrollment[]

  @@map("daycare_packages")
}

model DaycareEnrollment {
  id              String   @id @default(cuid())
  packageId       String
  tutorId         String
  petId           String

  // Validade
  startDate       DateTime
  endDate         DateTime?

  // Creditos (para pacotes de creditos)
  totalCredits    Int      @default(0)
  usedCredits     Int      @default(0)
  remainingCredits Int     @default(0)

  // Pagamento
  amount          Decimal  @db.Decimal(10,2)
  paymentStatus   PaymentStatus @default(PENDING)
  paidAt          DateTime?

  // Status
  isActive        Boolean  @default(true)

  // Timestamps
  createdAt       DateTime @default(now())

  // Relations
  package         DaycarePackage @relation(fields: [packageId], references: [id])
  tutor           Tutor          @relation(fields: [tutorId], references: [id])
  pet             Pet            @relation(fields: [petId], references: [id])
  attendances     DaycareAttendance[]

  @@index([tutorId])
  @@index([petId])
  @@map("daycare_enrollments")
}

model DaycareAttendance {
  id              String   @id @default(cuid())
  enrollmentId    String

  // Data
  date            DateTime @db.Date
  checkInTime     DateTime?
  checkOutTime    DateTime?

  // Status
  status          String   @default("SCHEDULED") // SCHEDULED, PRESENT, ABSENT, CANCELLED

  // Relatorio do dia
  behaviorNotes   String?
  activities      String[]
  feedingNotes    String?
  photos          String[]

  // Timestamps
  createdAt       DateTime @default(now())

  // Relations
  enrollment      DaycareEnrollment @relation(fields: [enrollmentId], references: [id])

  @@unique([enrollmentId, date])
  @@map("daycare_attendances")
}

// ============================================
// SERVICOS E AGENDAMENTOS
// ============================================

model Service {
  id              String   @id @default(cuid())
  businessId      String

  // Servico
  name            String
  description     String?
  category        String   // GROOMING, VET, VACCINE, EXAM, SURGERY, TRAINING

  // Duracao e preco
  duration        Int      // Minutos
  price           Decimal  @db.Decimal(10,2)

  // Preco por porte (opcional)
  priceBySize     Json?    // {MINI: 50, SMALL: 60, MEDIUM: 70, ...}

  // Restricoes
  acceptedSpecies Species[]
  acceptedSizes   PetSize[]
  requiresVet     Boolean  @default(false)

  // Status
  isActive        Boolean  @default(true)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  appointments    Appointment[]

  @@index([businessId])
  @@map("services")
}

model Appointment {
  id              String            @id @default(cuid())
  businessId      String
  tutorId         String
  petId           String
  serviceId       String
  professionalId  String

  // Agendamento
  appointmentType AppointmentType
  scheduledDate   DateTime
  scheduledTime   String            // HH:MM
  duration        Int               // Minutos
  endTime         String?

  // Status
  status          AppointmentStatus @default(SCHEDULED)
  confirmedAt     DateTime?
  startedAt       DateTime?
  completedAt     DateTime?
  cancelledAt     DateTime?
  cancellationReason String?

  // Valores
  price           Decimal           @db.Decimal(10,2)
  discount        Decimal           @default(0) @db.Decimal(10,2)
  finalPrice      Decimal           @db.Decimal(10,2)

  // Pagamento
  paymentStatus   PaymentStatus     @default(PENDING)
  paymentMethod   PaymentMethod?
  paidAt          DateTime?

  // Lembretes
  reminder24hSent Boolean           @default(false)
  reminder2hSent  Boolean           @default(false)

  // Observacoes
  notes           String?
  internalNotes   String?

  // Recorrencia
  isRecurring     Boolean           @default(false)
  recurrenceRule  String?           // "WEEKLY", "BIWEEKLY", "MONTHLY"
  parentAppointmentId String?

  // Timestamps
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  // Relations
  business        Business          @relation(fields: [businessId], references: [id])
  tutor           Tutor             @relation(fields: [tutorId], references: [id])
  pet             Pet               @relation(fields: [petId], references: [id])
  service         Service           @relation(fields: [serviceId], references: [id])
  professional    User              @relation(fields: [professionalId], references: [id])
  medicalRecords  MedicalRecord[]
  vaccineRecords  VaccineRecord[]

  @@index([businessId, scheduledDate])
  @@index([professionalId, scheduledDate])
  @@index([petId])
  @@index([status])
  @@map("appointments")
}

// ============================================
// PRODUTOS E ESTOQUE
// ============================================

model Product {
  id              String   @id @default(cuid())
  businessId      String

  // Identificacao
  name            String
  description     String?
  brand           String?
  sku             String?
  barcode         String?

  // Categoria
  category        String   // FOOD, TREATS, TOYS, ACCESSORIES, HYGIENE, MEDICINE, OTHER
  subcategory     String?
  forSpecies      Species[]

  // Precos
  costPrice       Decimal  @db.Decimal(10,2)
  salePrice       Decimal  @db.Decimal(10,2)
  promotionalPrice Decimal? @db.Decimal(10,2)
  promotionEndsAt DateTime?

  // Estoque
  currentStock    Decimal  @default(0) @db.Decimal(10,3)
  minStock        Decimal  @default(0) @db.Decimal(10,3)
  maxStock        Decimal? @db.Decimal(10,3)
  unit            String   @default("un") // un, kg, g, ml, L

  // Validade
  expirationDate  DateTime?
  alertDaysBefore Int      @default(30)

  // Fornecedor
  supplierId      String?
  supplierCode    String?

  // Media
  imageUrl        String?
  images          String[]

  // Status
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])
  stockMovements  StockMovement[]
  saleItems       SaleItem[]

  @@unique([businessId, sku])
  @@index([businessId, category])
  @@map("products")
}

model StockMovement {
  id              String            @id @default(cuid())
  productId       String

  // Movimento
  type            StockMovementType
  quantity        Decimal           @db.Decimal(10,3)
  previousStock   Decimal           @db.Decimal(10,3)
  newStock        Decimal           @db.Decimal(10,3)

  // Custo
  unitCost        Decimal?          @db.Decimal(10,2)
  totalCost       Decimal?          @db.Decimal(10,2)

  // Referencia
  saleId          String?
  appointmentId   String?
  notes           String?

  // Timestamps
  createdAt       DateTime          @default(now())

  // Relations
  product         Product           @relation(fields: [productId], references: [id])

  @@index([productId])
  @@map("stock_movements")
}

// ============================================
// VENDAS E FINANCEIRO
// ============================================

model Sale {
  id              String        @id @default(cuid())
  businessId      String
  tutorId         String?
  userId          String        // Quem vendeu

  // Valores
  subtotal        Decimal       @db.Decimal(10,2)
  discount        Decimal       @default(0) @db.Decimal(10,2)
  totalAmount     Decimal       @db.Decimal(10,2)

  // Pagamento
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(COMPLETED)
  installments    Int           @default(1)

  // Nota
  invoiceNumber   String?
  notes           String?

  // Timestamps
  createdAt       DateTime      @default(now())

  // Relations
  business        Business      @relation(fields: [businessId], references: [id])
  tutor           Tutor?        @relation(fields: [tutorId], references: [id])
  user            User          @relation(fields: [userId], references: [id])
  items           SaleItem[]

  @@index([businessId, createdAt])
  @@map("sales")
}

model SaleItem {
  id              String   @id @default(cuid())
  saleId          String
  productId       String?

  // Item
  description     String
  quantity        Decimal  @db.Decimal(10,3)
  unitPrice       Decimal  @db.Decimal(10,2)
  discount        Decimal  @default(0) @db.Decimal(10,2)
  totalPrice      Decimal  @db.Decimal(10,2)

  // Tipo
  itemType        String   // PRODUCT, SERVICE

  // Relations
  sale            Sale     @relation(fields: [saleId], references: [id])
  product         Product? @relation(fields: [productId], references: [id])

  @@map("sale_items")
}

model CashRegister {
  id              String   @id @default(cuid())
  businessId      String
  date            DateTime @db.Date

  // Totais por metodo
  cashTotal       Decimal  @default(0) @db.Decimal(10,2)
  pixTotal        Decimal  @default(0) @db.Decimal(10,2)
  creditTotal     Decimal  @default(0) @db.Decimal(10,2)
  debitTotal      Decimal  @default(0) @db.Decimal(10,2)

  // Resumo
  totalRevenue    Decimal  @default(0) @db.Decimal(10,2)
  totalExpenses   Decimal  @default(0) @db.Decimal(10,2)
  netAmount       Decimal  @default(0) @db.Decimal(10,2)

  // Contagens
  salesCount      Int      @default(0)
  servicesCount   Int      @default(0)

  // Status
  isClosed        Boolean  @default(false)
  closedAt        DateTime?
  closedById      String?
  notes           String?

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])

  @@unique([businessId, date])
  @@map("cash_registers")
}

// ============================================
// MARKETING
// ============================================

model Campaign {
  id              String   @id @default(cuid())
  businessId      String

  // Campanha
  name            String
  type            String   // VACCINE_REMINDER, BIRTHDAY, REACTIVATION, PROMOTION
  message         String

  // Segmento
  segmentType     String?  // ALL, DOG_OWNERS, CAT_OWNERS, INACTIVE, VIP
  customFilter    Json?

  // Status
  status          String   @default("DRAFT") // DRAFT, SCHEDULED, SENDING, COMPLETED
  scheduledFor    DateTime?
  completedAt     DateTime?

  // Stats
  totalRecipients Int      @default(0)
  sentCount       Int      @default(0)
  failedCount     Int      @default(0)
  responseCount   Int      @default(0)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  business        Business @relation(fields: [businessId], references: [id])

  @@index([businessId, status])
  @@map("campaigns")
}

// ============================================
// WHATSAPP
// ============================================

model WhatsAppMessage {
  id              String   @id @default(cuid())
  businessId      String
  remoteJid       String
  messageId       String?  @unique

  // Conteudo
  direction       String   // INBOUND, OUTBOUND
  content         String
  mediaUrl        String?
  mediaType       String?

  // Contexto
  tutorId         String?
  petId           String?
  appointmentId   String?

  // Status
  status          String   @default("SENT")
  sentAt          DateTime?
  deliveredAt     DateTime?
  readAt          DateTime?

  // Timestamps
  createdAt       DateTime @default(now())

  @@index([businessId])
  @@index([remoteJid])
  @@map("whatsapp_messages")
}

model MessageTemplate {
  id              String   @id @default(cuid())
  businessId      String

  // Template
  name            String
  type            String   // APPOINTMENT_CONFIRM, VACCINE_REMINDER, BIRTHDAY, BOARDING_UPDATE
  content         String
  variables       String[] // {{tutor_name}}, {{pet_name}}, {{date}}

  // Status
  isActive        Boolean  @default(true)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([businessId, type])
  @@map("message_templates")
}
```

---

# PARTE 4: ENDPOINTS DA API

## 4.1 Autenticacao
```
POST   /api/auth/login              # Login
POST   /api/auth/register           # Registro do negocio
POST   /api/auth/otp/request        # Solicitar OTP
POST   /api/auth/otp/verify         # Verificar OTP
GET    /api/auth/me                 # Usuario atual
POST   /api/auth/logout             # Logout
```

## 4.2 Tutores
```
GET    /api/tutors                  # Listar tutores
GET    /api/tutors/:id              # Detalhes
POST   /api/tutors                  # Criar tutor
PUT    /api/tutors/:id              # Atualizar
DELETE /api/tutors/:id              # Remover
GET    /api/tutors/:id/pets         # Pets do tutor
GET    /api/tutors/:id/history      # Historico completo
```

## 4.3 Pets
```
GET    /api/pets                    # Listar pets
GET    /api/pets/:id                # Detalhes
POST   /api/pets                    # Criar pet
PUT    /api/pets/:id                # Atualizar
DELETE /api/pets/:id                # Remover
GET    /api/pets/:id/vaccines       # Carteira de vacinas
GET    /api/pets/:id/medical        # Prontuario
GET    /api/pets/:id/appointments   # Historico de atendimentos
POST   /api/pets/:id/photo          # Upload foto
```

## 4.4 Prontuario Veterinario
```
GET    /api/medical-records         # Listar prontuarios
GET    /api/medical-records/:id     # Detalhes
POST   /api/medical-records         # Criar registro
PUT    /api/medical-records/:id     # Atualizar
GET    /api/medical-records/:id/pdf # Exportar PDF
```

## 4.5 Vacinas
```
GET    /api/vaccines                # Listar vacinas
GET    /api/vaccines/pending        # Vacinas vencendo
POST   /api/vaccines                # Registrar vacina
PUT    /api/vaccines/:id            # Atualizar
GET    /api/vaccines/:petId/card    # Carteira digital
GET    /api/vaccines/:petId/card/pdf # Carteira PDF
```

## 4.6 Adocao
```
GET    /api/adoption/animals        # Animais para adocao
GET    /api/adoption/animals/:id    # Detalhes
POST   /api/adoption/animals        # Cadastrar animal
PUT    /api/adoption/animals/:id    # Atualizar
GET    /api/adoption/animals/:id/inquiries # Interessados

POST   /api/adoption/inquiries      # Manifestar interesse
PUT    /api/adoption/inquiries/:id  # Atualizar status

GET    /api/adoption/processes      # Processos de adocao
POST   /api/adoption/processes      # Iniciar processo
PUT    /api/adoption/processes/:id  # Atualizar etapa
POST   /api/adoption/processes/:id/complete # Finalizar adocao
```

## 4.7 Hospedagem
```
GET    /api/boarding/rooms          # Listar quartos
POST   /api/boarding/rooms          # Criar quarto
PUT    /api/boarding/rooms/:id      # Atualizar
GET    /api/boarding/rooms/availability # Disponibilidade

GET    /api/boarding/reservations   # Listar reservas
POST   /api/boarding/reservations   # Criar reserva
PUT    /api/boarding/reservations/:id # Atualizar
POST   /api/boarding/reservations/:id/checkin  # Check-in
POST   /api/boarding/reservations/:id/checkout # Check-out
POST   /api/boarding/reservations/:id/cancel   # Cancelar

POST   /api/boarding/reservations/:id/updates  # Adicionar atualizacao
GET    /api/boarding/reservations/:id/updates  # Listar atualizacoes
POST   /api/boarding/reservations/:id/updates/:updateId/send # Enviar ao tutor
```

## 4.8 Daycare
```
GET    /api/daycare/packages        # Listar pacotes
POST   /api/daycare/packages        # Criar pacote
PUT    /api/daycare/packages/:id    # Atualizar

GET    /api/daycare/enrollments     # Matriculas
POST   /api/daycare/enrollments     # Matricular
PUT    /api/daycare/enrollments/:id # Atualizar

GET    /api/daycare/attendance      # Frequencia do dia
POST   /api/daycare/attendance/:id/checkin  # Check-in
POST   /api/daycare/attendance/:id/checkout # Check-out
PUT    /api/daycare/attendance/:id  # Atualizar relatorio
```

## 4.9 Agendamentos
```
GET    /api/appointments            # Listar agendamentos
GET    /api/appointments/:id        # Detalhes
POST   /api/appointments            # Criar
PUT    /api/appointments/:id        # Atualizar
POST   /api/appointments/:id/confirm # Confirmar
POST   /api/appointments/:id/start  # Iniciar atendimento
POST   /api/appointments/:id/complete # Finalizar
POST   /api/appointments/:id/cancel # Cancelar
GET    /api/appointments/calendar   # Calendario
GET    /api/appointments/available-slots # Horarios disponiveis
```

## 4.10 Servicos
```
GET    /api/services                # Listar servicos
POST   /api/services                # Criar
PUT    /api/services/:id            # Atualizar
DELETE /api/services/:id            # Remover
```

## 4.11 Produtos e Estoque
```
GET    /api/products                # Listar produtos
GET    /api/products/:id            # Detalhes
POST   /api/products                # Criar
PUT    /api/products/:id            # Atualizar
DELETE /api/products/:id            # Remover
GET    /api/products/low-stock      # Estoque baixo
GET    /api/products/expiring       # Vencendo

POST   /api/stock/movements         # Registrar movimento
GET    /api/stock/movements         # Historico
```

## 4.12 Vendas
```
GET    /api/sales                   # Listar vendas
GET    /api/sales/:id               # Detalhes
POST   /api/sales                   # Criar venda
PUT    /api/sales/:id               # Atualizar
POST   /api/sales/:id/cancel        # Cancelar
```

## 4.13 Financeiro
```
GET    /api/finance/dashboard       # Dashboard financeiro
GET    /api/finance/cash-register   # Caixa do dia
POST   /api/finance/cash-register/open  # Abrir caixa
POST   /api/finance/cash-register/close # Fechar caixa
GET    /api/finance/reports/daily   # Relatorio diario
GET    /api/finance/reports/monthly # Relatorio mensal
GET    /api/finance/commissions     # Comissoes
```

## 4.14 WhatsApp
```
POST   /api/whatsapp/system/setup   # Configurar instancia
GET    /api/whatsapp/system/status  # Status conexao
GET    /api/whatsapp/system/qrcode  # QR Code
POST   /api/whatsapp/send/text      # Enviar texto
POST   /api/whatsapp/send/image     # Enviar imagem
POST   /api/whatsapp/send/vaccine-card # Enviar carteira vacinas
POST   /api/whatsapp/webhooks       # Receber mensagens
```

## 4.15 Analytics
```
GET    /api/analytics/dashboard     # KPIs principais
GET    /api/analytics/appointments  # Metricas atendimentos
GET    /api/analytics/pets          # Metricas pets
GET    /api/analytics/revenue       # Receita
GET    /api/analytics/services      # Servicos mais vendidos
GET    /api/analytics/products      # Produtos mais vendidos
```

---

# PARTE 5: PAGINAS DO FRONTEND

```
/                               # Landing page
/login                          # Login
/register                       # Registro

/dashboard                      # Dashboard principal

/tutores                        # Lista de tutores
/tutores/novo                   # Cadastrar tutor
/tutores/:id                    # Detalhes do tutor

/pets                           # Lista de pets
/pets/novo                      # Cadastrar pet
/pets/:id                       # Detalhes do pet
/pets/:id/prontuario            # Prontuario completo
/pets/:id/vacinas               # Carteira de vacinas

/agenda                         # Calendario de agendamentos
/agenda/novo                    # Novo agendamento

/atendimento                    # Tela de atendimento (consulta)
/atendimento/:appointmentId     # Atendimento em andamento

/adocao                         # Lista animais para adocao
/adocao/novo                    # Cadastrar animal
/adocao/:id                     # Detalhes
/adocao/:id/processos           # Processos de adocao

/hospedagem                     # Dashboard hospedagem
/hospedagem/quartos             # Gestao de quartos
/hospedagem/reservas            # Lista reservas
/hospedagem/reservas/nova       # Nova reserva
/hospedagem/reservas/:id        # Detalhes reserva
/hospedagem/ocupacao            # Mapa de ocupacao

/daycare                        # Dashboard daycare
/daycare/pacotes                # Pacotes
/daycare/matriculas             # Matriculas
/daycare/presenca               # Controle presenca dia

/servicos                       # Lista de servicos
/produtos                       # Lista de produtos
/estoque                        # Controle de estoque

/pdv                            # Ponto de venda
/financeiro                     # Dashboard financeiro
/financeiro/caixa               # Caixa do dia
/financeiro/relatorios          # Relatorios

/marketing                      # Campanhas
/whatsapp                       # Configuracao WhatsApp
/configuracoes                  # Configuracoes gerais
/usuarios                       # Gestao de usuarios
```

---

# PARTE 6: AUTOMACOES WHATSAPP

## 6.1 Lembretes de Vacina
```
Gatilho: Vacina vencendo
Momento: 30d, 7d, 1d antes

Mensagem 30 dias:
"Ola {{tutor_name}}! A vacina {{vaccine_name}} do(a) {{pet_name}} vence em 30 dias ({{due_date}}). Que tal ja agendar? Responda AGENDAR para marcar horario."

Mensagem 7 dias:
"{{tutor_name}}, lembrete: a vacina {{vaccine_name}} do(a) {{pet_name}} vence em 7 dias! Nao deixe para ultima hora. Agende agora respondendo AGENDAR."

Mensagem dia:
"Atencao {{tutor_name}}! A vacina {{vaccine_name}} do(a) {{pet_name}} vence HOJE. Ligue para nos ou responda para agendar urgente!"
```

## 6.2 Confirmacao de Agendamento
```
Gatilho: Agendamento criado

Mensagem:
"Agendamento confirmado!
Pet: {{pet_name}}
Servico: {{service_name}}
Data: {{date}} as {{time}}
Profissional: {{professional_name}}

Responda CONFIRMAR para confirmar ou REMARCAR para alterar."
```

## 6.3 Lembrete de Agendamento
```
Gatilho: 24h e 2h antes

Mensagem 24h:
"Ola {{tutor_name}}! Amanha temos um horario marcado para o(a) {{pet_name}}:
- {{service_name}}
- {{date}} as {{time}}

Confirma presenca? Responda SIM ou NAO."

Mensagem 2h:
"Lembrete: em 2 horas o(a) {{pet_name}} tem {{service_name}} agendado. Nos vemos em breve!"
```

## 6.4 Atualizacao de Hospedagem
```
Gatilho: Diario, durante hospedagem

Mensagem:
"Diario do(a) {{pet_name}} - {{date}}

Como passou: {{behavior}}
Alimentacao: {{feeding}}
Atividades: {{activities}}

{{photos}}

Qualquer duvida, estamos a disposicao!"
```

## 6.5 Aniversario do Pet
```
Gatilho: Data de nascimento

Mensagem:
"Feliz aniversario {{pet_name}}! 🎂🐾

Hoje o(a) {{pet_name}} completa {{age}}!

Para comemorar, preparamos um presente especial: 10% de desconto no proximo banho!

Use o codigo: NIVER{{pet_name}}

Valido por 7 dias."
```

## 6.6 Reativacao de Inativos
```
Gatilho: 60 dias sem visita

Mensagem:
"Ola {{tutor_name}}, sentimos saudades do(a) {{pet_name}}!

Ja faz {{days}} dias desde a ultima visita. Esta tudo bem?

Aproveite 15% de desconto no proximo servico!
Codigo: VOLTEI15

Agende respondendo esta mensagem."
```

## 6.7 Pos-Adocao
```
Gatilho: 7, 30, 90 dias apos adocao

Mensagem 7 dias:
"Ola {{tutor_name}}! Como estao os primeiros dias com o(a) {{pet_name}}?

Gostavamos de saber como esta sendo a adaptacao. Pode nos enviar uma foto?

Qualquer duvida sobre cuidados, estamos aqui para ajudar!"
```

## 6.8 Carteira de Vacinas
```
Gatilho: Solicitacao do tutor ou pos-vacinacao

Mensagem:
"Aqui esta a carteira de vacinacao digital do(a) {{pet_name}}!

{{vaccine_card_link}}

Voce pode acessar a qualquer momento por este link. Valido para viagens, hoteis e outros estabelecimentos."
```

---

# PARTE 7: DOCKER COMPOSE PRODUCAO

```yaml
# docker-compose.prod.yml
services:
  postgres:
    image: postgres:15-alpine
    container_name: pet360-postgres
    restart: always
    ports:
      - "127.0.0.1:5432:5432"
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - pet360-network

  redis:
    image: redis:7-alpine
    container_name: pet360-redis
    restart: always
    command: redis-server --appendonly yes --maxmemory 256mb
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
    networks:
      - pet360-network

  evolution-api:
    image: evoapicloud/evolution-api:v2.3.7
    container_name: pet360-evolution
    restart: always
    environment:
      - SERVER_URL=${EVOLUTION_PUBLIC_URL}
      - AUTHENTICATION_TYPE=apikey
      - AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379
      - WEBHOOK_GLOBAL_URL=http://api:3001/api/webhooks/whatsapp
      - WEBHOOK_GLOBAL_ENABLED=true
    volumes:
      - evolution_instances:/evolution/instances
      - evolution_store:/evolution/store
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget -q --spider http://localhost:8080/ || exit 1"]
      interval: 10s
      start_period: 30s
    networks:
      - pet360-network

  api:
    build:
      context: .
      dockerfile: docker/api/Dockerfile
      target: production
    container_name: pet360-api
    restart: always
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - EVOLUTION_API_URL=http://evolution-api:8080
      - EVOLUTION_API_KEY=${EVOLUTION_API_KEY}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - pet360-network

  web:
    build:
      context: .
      dockerfile: docker/web/Dockerfile
      target: production
      args:
        - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    container_name: pet360-web
    restart: always
    depends_on:
      - api
    networks:
      - pet360-network

  nginx:
    image: nginx:alpine
    container_name: pet360-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/certs:/etc/nginx/certs:ro
    depends_on:
      - web
      - api
    networks:
      - pet360-network

networks:
  pet360-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
  evolution_instances:
  evolution_store:
```

---

# PARTE 8: VARIAVEIS DE AMBIENTE

```env
# .env.example

# Database
POSTGRES_USER=pet360
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=pet360

# API
NODE_ENV=production
JWT_SECRET=your_jwt_secret_minimum_32_chars
JWT_REFRESH_SECRET=your_refresh_secret

# Evolution API (WhatsApp)
EVOLUTION_API_KEY=your_evolution_api_key
EVOLUTION_PUBLIC_URL=https://whatsapp.yourdomain.com
EVOLUTION_INSTANCE_NAME=pet360_main

# Frontend
FRONTEND_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# Optional
SENTRY_DSN=
```

---

# PARTE 9: CHECKLIST DE IMPLEMENTACAO

## Fase 1: Foundation (MVP)
- [ ] Setup monorepo pnpm
- [ ] Docker Compose dev/prod
- [ ] Schema Prisma basico
- [ ] Auth (login/registro)
- [ ] CRUD Tutores
- [ ] CRUD Pets
- [ ] Dashboard basico

## Fase 2: Veterinario
- [ ] Prontuario medico
- [ ] Carteira de vacinacao
- [ ] Receituario
- [ ] Historico do pet
- [ ] Export PDF

## Fase 3: Agendamentos
- [ ] Servicos
- [ ] Calendario visual
- [ ] Agendamentos
- [ ] Confirmacao automatica

## Fase 4: Adocao
- [ ] Cadastro animais
- [ ] Processo de adocao
- [ ] Questionario
- [ ] Termo de adocao
- [ ] Acompanhamento

## Fase 5: Hospedagem
- [ ] Quartos
- [ ] Reservas
- [ ] Check-in/out
- [ ] Diario do pet
- [ ] Envio fotos

## Fase 6: Daycare
- [ ] Pacotes
- [ ] Matriculas
- [ ] Controle presenca
- [ ] Relatorio diario

## Fase 7: PDV e Estoque
- [ ] Produtos
- [ ] Estoque
- [ ] Vendas
- [ ] Caixa

## Fase 8: WhatsApp
- [ ] Integracao Evolution
- [ ] Templates
- [ ] Automacoes
- [ ] Envio carteira vacinas

## Fase 9: App do Tutor
- [ ] Login
- [ ] Ver pets
- [ ] Carteira vacinas
- [ ] Agendar
- [ ] Acompanhar hospedagem

## Fase 10: Analytics
- [ ] Dashboard
- [ ] Relatorios
- [ ] Metricas
- [ ] Export

---

# PARTE 10: DIFERENCIAIS COMPETITIVOS

1. **Carteira de vacinacao digital** com QR Code
2. **Prontuario veterinario completo** com historico
3. **Processo de adocao estruturado** com acompanhamento
4. **Diario do pet** durante hospedagem (fotos/videos)
5. **App do tutor** para acompanhamento
6. **WhatsApp nativo** para comunicacao
7. **Lembretes automaticos** de vacinas e retornos
8. **Integracao com laboratorios** para resultados de exames
9. **Telemedicina** para consultas online
10. **Multi-estabelecimento** (rede de clinicas)

---

# PARTE 11: IDEIAS ADICIONAIS

## 11.1 Telemedicina Veterinaria
- Videochamada com veterinario
- Triagem inicial
- Acompanhamento pos-consulta
- Segunda opiniao

## 11.2 Plano de Saude Pet
- Pacotes mensais
- Vacinas incluidas
- Desconto em servicos
- Emergencia 24h

## 11.3 Delivery de Produtos
- Integracao iFood/Rappi
- Entrega propria
- Assinatura de racao

## 11.4 Rede de Parceiros
- Adestradores
- Pet sitters
- Passeadores
- Fotografos pet

## 11.5 Programa de Fidelidade
- Pontos por compra
- Troca por servicos
- Niveis (Bronze, Prata, Ouro)

## 11.6 Integracao com Seguros
- Cotacao automatica
- Sinistro pelo app
- Historico medico integrado

## 11.7 Comunidade de Adocao
- Match adotante-animal
- Historias de sucesso
- Eventos de adocao
- Apadrinhamento

## 11.8 Monitoramento IoT
- Coleira com GPS
- Bebedouro inteligente
- Comedouro automatico
- Alertas de saude

---

*Documento gerado em 05/01/2026*
*Baseado no projeto Bela360*
