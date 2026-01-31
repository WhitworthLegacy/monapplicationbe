/**
 * MonApplication Packages / Packs
 * Based on /tarifs page from web app
 */

export interface PackageFeature {
  label: string;
  description?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number; // in cents
  priceLabel: string;
  description: string;
  detailedDescription: string;
  features: PackageFeature[];
  color: string;
}

export const PACKAGES: Package[] = [
  {
    id: 'fondations',
    name: 'Fondations',
    price: 500000, // 5000€ in cents
    priceLabel: '5 000€',
    description: 'Votre secrétaire digitale complète',
    detailedDescription:
      'Tout ce qu\'il faut pour automatiser votre admin : site web pro optimisé SEO, booking RDV en ligne 24h/24, générateur de devis en 2 clics, CRM clients complet, calendrier intelligent. Plus une formation de 2h et 30 jours de support.',
    features: [
      { label: 'Site web professionnel + SEO' },
      { label: 'Booking RDV en ligne 24h/24' },
      { label: 'Générateur de devis' },
      { label: 'CRM clients complet' },
      { label: 'Calendrier intelligent' },
      { label: 'Formation (2h) + Support 30j' },
    ],
    color: '#0f172a', // primary
  },
  {
    id: 'notifications',
    name: 'Notifications',
    price: 150000, // 1500€ in cents
    priceLabel: '+1 500€',
    description: 'Zéro oubli, zéro no-show',
    detailedDescription:
      'Réduisez les no-shows de 80% : rappels SMS automatiques avant chaque RDV, emails de confirmation, alertes personnalisées et suivi complet de tous vos envois. Vos clients n\'oublient plus jamais leurs rendez-vous.',
    features: [
      { label: 'Rappels SMS avant RDV' },
      { label: 'Emails automatiques' },
      { label: 'Alertes personnalisées' },
      { label: 'Confirmations auto' },
      { label: 'Suivi des envois' },
    ],
    color: '#16a34a', // green-600
  },
  {
    id: 'marketing',
    name: 'Marketing',
    price: 250000, // 2500€ in cents
    priceLabel: '+2 500€',
    description: 'Réponse IA 24h/24 sur tous les canaux',
    detailedDescription:
      'Soyez disponible partout, tout le temps : WhatsApp Business, Messenger et Instagram DM intégrés avec une IA qui répond naturellement à vos clients. Impossible de la distinguer d\'un humain — et elle travaille 24h/24.',
    features: [
      { label: 'WhatsApp Business intégré' },
      { label: 'Messenger automatisé' },
      { label: 'Instagram DM' },
      { label: 'Réponse IA naturelle' },
      { label: 'Disponible 24h/24' },
    ],
    color: '#b8860b', // accent
  },
];

export interface Pack {
  id: string;
  name: string;
  price: number; // in cents
  priceLabel: string;
  originalPrice?: number; // in cents
  description: string;
  packageIds: string[];
  popular?: boolean;
  savings?: string;
}

export const PACKS: Pack[] = [
  {
    id: 'fondations',
    name: 'FONDATIONS',
    price: 500000,
    priceLabel: '5 000€',
    description: 'Votre secrétaire digitale',
    packageIds: ['fondations'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 650000,
    priceLabel: '6 500€',
    description: 'Le plus populaire',
    packageIds: ['fondations', 'notifications'],
    popular: true,
  },
  {
    id: 'full',
    name: 'FULL',
    price: 800000,
    priceLabel: '8 000€',
    originalPrice: 900000,
    description: 'Tout automatisé',
    packageIds: ['fondations', 'notifications', 'marketing'],
    popular: false,
    savings: 'Économisez 1 000€',
  },
];

/**
 * Get package details by ID
 */
export function getPackageById(id: string): Package | undefined {
  return PACKAGES.find((pkg) => pkg.id === id);
}

/**
 * Get pack details by ID
 */
export function getPackById(id: string): Pack | undefined {
  return PACKS.find((pack) => pack.id === id);
}

/**
 * Get all features for a pack (combines all packages)
 */
export function getPackFeatures(packId: string): PackageFeature[] {
  const pack = getPackById(packId);
  if (!pack) return [];

  const features: PackageFeature[] = [];
  pack.packageIds.forEach((packageId) => {
    const pkg = getPackageById(packageId);
    if (pkg) {
      features.push(...pkg.features);
    }
  });

  return features;
}

/**
 * Generate quote description from pack/package
 */
export function generateQuoteDescription(
  packId?: string,
  packageIds?: string[]
): string {
  if (packId) {
    const pack = getPackById(packId);
    if (!pack) return '';

    const packages = pack.packageIds
      .map((id) => getPackageById(id))
      .filter(Boolean) as Package[];

    let description = `**${pack.name}** - ${pack.description}\n\n`;

    packages.forEach((pkg) => {
      description += `### ${pkg.name} (${pkg.priceLabel})\n`;
      description += `${pkg.detailedDescription}\n\n`;
      description += `**Inclus :**\n`;
      pkg.features.forEach((feature) => {
        description += `• ${feature.label}\n`;
      });
      description += `\n`;
    });

    return description.trim();
  }

  if (packageIds && packageIds.length > 0) {
    const packages = packageIds
      .map((id) => getPackageById(id))
      .filter(Boolean) as Package[];

    let description = '';
    packages.forEach((pkg, index) => {
      if (index > 0) description += '\n\n';
      description += `### ${pkg.name} (${pkg.priceLabel})\n`;
      description += `${pkg.detailedDescription}\n\n`;
      description += `**Inclus :**\n`;
      pkg.features.forEach((feature) => {
        description += `• ${feature.label}\n`;
      });
    });

    return description.trim();
  }

  return '';
}

/**
 * Calculate total price from package IDs
 */
export function calculatePackagePrice(packageIds: string[]): number {
  return packageIds.reduce((total, id) => {
    const pkg = getPackageById(id);
    return total + (pkg?.price || 0);
  }, 0);
}
