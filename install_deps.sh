#!/bin/bash

echo "🔧 Installation des dépendances monapplicationbe"
echo ""

# Source Homebrew
if [ -f "/opt/homebrew/bin/brew" ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Vérifier Node
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
else
    echo "❌ Node.js non trouvé dans PATH"
    echo "Essayez de sourcer votre profile:"
    echo "  source ~/.zprofile"
    echo "  ou"
    echo "  eval \"\$(/opt/homebrew/bin/brew shellenv)\""
    exit 1
fi

# Nettoyer node_modules si nécessaire
if [ -d "node_modules" ]; then
    echo "🧹 Nettoyage de node_modules..."
    rm -rf node_modules
fi

# Installer les dépendances
echo "📦 Installation de resend et @supabase/supabase-js..."
npm install resend @supabase/supabase-js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation réussie!"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Configurer Resend: https://resend.com"
    echo "2. Configurer Supabase: https://supabase.com"
    echo "3. Remplir .env.local avec vos clés"
    echo "4. Lancer: npm run dev"
else
    echo ""
    echo "❌ Erreur lors de l'installation"
    exit 1
fi
