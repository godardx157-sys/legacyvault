# 🏺 LegacyVault

> Capsules temporelles numériques — transmettez votre héritage à travers le temps.

## Concept

LegacyVault permet de créer des messages, photos et vidéos à envoyer à ses proches à une date précise ou après son décès via un **Dead Man's Switch** automatique.

**Pourquoi ça n'existait pas ?** Plusieurs services obscurs existent, mais aucun n'est simple, beau, et accessible. LegacyVault est la première plateforme grand public sur ce segment émotionnel universel.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + PostgreSQL (Neon recommandé — gratuit)
- **NextAuth.js** (Email + Google OAuth)
- **Stripe** (abonnements)
- **Cloudinary** (stockage médias — gratuit jusqu'à 25 GB)
- **Nodemailer** (emails SMTP)
- **Tailwind CSS** (Cormorant Garamond + EB Garamond fonts)

## Déploiement sur Vercel (15 min)

### 1. Base de données (Neon — gratuit)

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un projet "legacyvault"
3. Copier la `DATABASE_URL` de connexion

### 2. Cloudinary (stockage médias — gratuit)

1. Compte sur [cloudinary.com](https://cloudinary.com)
2. Dans Settings > Upload Presets, créer un preset **`legacyvault_uploads`** (unsigned)
3. Copier Cloud Name, API Key, API Secret

### 3. Stripe

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Dans Products, créer :
   - "Héritage" à 9€/mois → copier le Price ID
   - "Éternel" à 19€/mois → copier le Price ID
3. Dans Developers > API Keys, copier les clés

### 4. Google OAuth (optionnel)

1. [console.cloud.google.com](https://console.cloud.google.com)
2. Créer un projet, activer Google+ API
3. OAuth Credentials → Web application
4. Authorized redirect URIs: `https://votredomaine.com/api/auth/callback/google`

### 5. Email SMTP

- **Gmail** : activer "App Password" dans les paramètres de sécurité
- **Resend** : [resend.com](https://resend.com) (100 emails/jour gratuits)
- **Brevo** : [brevo.com](https://brevo.com) (300 emails/jour gratuits)

### 6. Déployer sur Vercel

```bash
# Cloner et installer
npm install

# Pousser le schéma DB (après avoir défini DATABASE_URL en local)
npx prisma db push

# Déployer
vercel --prod
```

Ou via GitHub : connecter le repo sur [vercel.com](https://vercel.com/new).

### 7. Variables d'environnement sur Vercel

Dans Project Settings > Environment Variables, ajouter toutes les variables du fichier `.env.example`.

**Important pour NEXTAUTH_SECRET** :
```bash
openssl rand -base64 32
```

### 8. Webhook Stripe

Dans Stripe Dashboard > Developers > Webhooks :
- URL : `https://votredomaine.vercel.app/api/stripe/webhook`
- Événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copier le Webhook Secret → `STRIPE_WEBHOOK_SECRET`

### 9. Cron (livraisons automatiques)

Le fichier `vercel.json` configure déjà le cron à 8h00 UTC chaque jour.
Pour sécuriser l'endpoint, générer un `CRON_SECRET` :
```bash
openssl rand -base64 32
```

## Modèle économique

| Plan | Prix | Marge |
|------|------|-------|
| Souvenir (Free) | 0€ | Lead magnet |
| Héritage | 9€/mois | ~98% marge |
| Éternel | 19€/mois | ~98% marge |

**Coûts infrastructure** :
- Neon DB : gratuit (tier hobby)
- Cloudinary : gratuit jusqu'à 25 GB
- Vercel : gratuit (hobby) → 20$/mois (pro) si trafic
- Stripe : 1.4% + 0.25€ par transaction

**Revenus potentiels** :
- 100 utilisateurs Pro = 900€/mois
- 1000 utilisateurs Pro = 9000€/mois

## Structure du projet

```
legacyvault/
├── app/
│   ├── (auth)/login + register
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx              # Overview
│   │   ├── capsules/             # CRUD capsules
│   │   ├── billing/              # Abonnement Stripe
│   │   └── settings/             # Paramètres + DMS
│   ├── (marketing)/pricing/
│   ├── api/
│   │   ├── auth/                 # NextAuth + register
│   │   ├── capsules/             # CRUD API
│   │   ├── checkin/              # Dead Man's Switch
│   │   ├── stripe/               # Checkout, webhook, portal
│   │   ├── upload/               # Cloudinary upload
│   │   └── cron/deliver/         # Livraison automatique
│   └── page.tsx                  # Landing page
├── components/
│   ├── layout/Sidebar + Header
│   ├── capsule/NewCapsuleForm + ...
│   └── pricing/UpgradeButton + ...
├── lib/
│   ├── auth.ts, prisma.ts, stripe.ts, email.ts, utils.ts
├── prisma/schema.prisma
└── vercel.json                   # Cron config
```

## Sécurité

- ✅ Passwords hashés avec bcrypt (salt 12)
- ✅ Sessions JWT signées (NEXTAUTH_SECRET)
- ✅ CSRF protection (NextAuth)
- ✅ Middleware de protection des routes `/dashboard/*`
- ✅ Validation des inputs avec Zod
- ✅ Vérification d'ownership des capsules sur chaque requête
- ✅ Vérification signature webhook Stripe
- ✅ Rate limiting endpoint cron via CRON_SECRET
- ✅ Limites de plan vérifiées côté serveur
