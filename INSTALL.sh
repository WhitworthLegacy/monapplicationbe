#!/bin/bash

echo "🚀 Installation des dépendances MonApplicationBE"
echo ""

# Vérifier si Homebrew est installé
if ! command -v brew &> /dev/null; then
    echo "📦 Installation de Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Ajouter Homebrew au PATH
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "📦 Installation de Node.js via Homebrew..."
    brew install node
fi

# Vérifier si pnpm est installé
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installation de pnpm..."
    npm install -g pnpm
fi

echo ""
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo "✅ pnpm version: $(pnpm --version)"
echo ""

# Installer les dépendances du projet
echo "📦 Installation des dépendances du projet..."
cd /Volumes/YaqubLegacy/Dev/monapplicationbe

if [ -f "pnpm-lock.yaml" ]; then
    echo "Utilisation de pnpm..."
    pnpm install resend @supabase/supabase-js
else
    echo "Utilisation de npm..."
    npm install resend @supabase/supabase-js
fi

echo ""
echo "✅ Installation terminée!"
echo ""
echo "Prochaines étapes:"
echo "1. Configurer Resend: https://resend.com"
echo "2. Configurer Supabase: https://supabase.com"
echo "3. Remplir le fichier .env.local"
echo "4. Lancer: npm run dev"
