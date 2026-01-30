/**
 * CRM Stages pour MonApplication.be
 * Flux B2B: Prospect → Devis → Gagné/Perdu
 */
export const CRM_STAGES = {
  PROSPECT: 'prospect',
  PROPOSAL: 'proposal',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
} as const;

export type CrmStage = typeof CRM_STAGES[keyof typeof CRM_STAGES];

/**
 * Configuration des colonnes CRM par défaut
 */
export const DEFAULT_CRM_COLUMNS = [
  {
    id: '1',
    slug: CRM_STAGES.PROSPECT,
    label: 'Prospect',
    position: 1,
    color: 'gray',
    description: 'Nouveaux contacts identifiés',
  },
  {
    id: '2',
    slug: CRM_STAGES.PROPOSAL,
    label: 'Devis',
    position: 2,
    color: 'yellow',
    description: 'Devis envoyé',
  },
  {
    id: '3',
    slug: CRM_STAGES.CLOSED_WON,
    label: 'Gagné',
    position: 3,
    color: 'teal',
    description: 'Deal conclu',
  },
  {
    id: '4',
    slug: CRM_STAGES.CLOSED_LOST,
    label: 'Perdu',
    position: 4,
    color: 'red',
    description: 'Deal perdu',
  },
] as const;

/**
 * Sources de lead possibles
 */
export const LEAD_SOURCES = {
  COLD_CALL: 'cold_call',
  EMAIL: 'email',
  LINKEDIN: 'linkedin',
  REFERRAL: 'referral',
  WEBSITE: 'website',
  EVENT: 'event',
  OTHER: 'other',
} as const;

export const LEAD_SOURCE_LABELS: Record<keyof typeof LEAD_SOURCES, string> = {
  COLD_CALL: 'Cold Call',
  EMAIL: 'Email',
  LINKEDIN: 'LinkedIn',
  REFERRAL: 'Référence',
  WEBSITE: 'Site Web',
  EVENT: 'Événement',
  OTHER: 'Autre',
};

/**
 * Types de communication préférés
 */
export const COMMUNICATION_PREFERENCES = {
  EMAIL: 'email',
  PHONE: 'phone',
  WHATSAPP: 'whatsapp',
  SMS: 'sms',
  MEET: 'meet',
} as const;

/**
 * Statuts d'appel
 */
export const CALL_STATUS = {
  NOT_CALLED: 'not_called',
  NO_ANSWER: 'no_answer',
  VOICEMAIL: 'voicemail',
  CONNECTED: 'connected',
  CALLBACK_REQUESTED: 'callback_requested',
  NOT_INTERESTED: 'not_interested',
} as const;

export const CALL_STATUS_LABELS: Record<keyof typeof CALL_STATUS, string> = {
  NOT_CALLED: 'Pas encore appelé',
  NO_ANSWER: 'Pas de réponse',
  VOICEMAIL: 'Messagerie',
  CONNECTED: 'Contacté',
  CALLBACK_REQUESTED: 'Rappel demandé',
  NOT_INTERESTED: 'Pas intéressé',
};

/**
 * Secteurs d'activité cibles
 */
export const INDUSTRIES = [
  'BTP',
  'Transport',
  'Logistique',
  'Commerce',
  'Services',
  'Industrie',
  'Santé',
  'Restauration',
  'Autre',
] as const;

export type Industry = typeof INDUSTRIES[number];

/**
 * Tailles d'entreprise
 */
export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '500+',
] as const;

export type CompanySize = typeof COMPANY_SIZES[number];
