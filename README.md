# 🍹 SoloBar POS

> **Caisse Tactile & Gestion de Stock Ultra-Rapide pour Bars, Caves et Buvettes Mono-Opérateur.**  
> *Spécialement conçu pour les établissements où une seule personne assure à la fois le rôle de Barman et de Caissière.*

---

## ⚡ Points Forts & Philosophie "One-Touch"

Dans une petite buvette, un bar de quartier ou une cave, vous n'avez pas le temps de naviguer entre 4 écrans différents. **SoloBar POS** réunit tout sur un seul écran tactile :
* 🍻 **Prise de commande en 1 clic** : Grille visuelle avec filtres directs (Bières, Vins, Spiritueux, Cocktails, Softs, Snacks).
* 💰 **Multi-Paiement Express** :
  * **Espèces** : Calculateur automatique de monnaie à rendre avec boutons de coupures rapides (+500, +1 000, +2 000, +5 000, +10 000 F CFA).
  * **Mobile Money** : Prise en charge MTN MoMo, Airtel Money, Orange Money, Wave.
  * **Carte Bancaire (TPE)**.
  * **Ardoise / Crédit Client** : Enregistrement rapide pour les clients habitués.
* 📦 **Décompte de stock instantané** : Déduction automatique à chaque vente + boutons de réapprovisionnement par casier (+12, +24).
* 🧾 **Impression de ticket sécurisée (anti-XSS)** : Compatible imprimantes thermiques 58mm / 80mm.
* 🔒 **Sécurité Durcie (Security by Design)** :
  * Zéro mot de passe codé en dur.
  * Assainissement systématique des entrées pour bloquer toute injection XSS.
  * Code PIN sécurisé par hachage SHA-256 local.
* 📶 **Mode 100% Hors-Ligne (Local-First)** : Vos données restent disponibles et enregistrées même en cas de coupure Internet.
* 🚀 **Prêt pour Vercel** : Fichier `vercel.json` inclus avec réécriture SPA et en-têtes de sécurité HTTP.

---

## 🛠️ Stack Technique

* **Framework** : [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styles** : [Tailwind CSS v4](https://tailwindcss.com/)
* **Gestion d'état** : [Zustand](https://github.com/pmndrs/zustand) avec persistance locale automatique
* **Icônes** : [Lucide React](https://lucide.dev/)

---

## 🚀 Installation & Lancement Local

```bash
# 1. Se placer dans le répertoire du projet
cd solobar-pos

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

---

## 🌐 Déploiement sur Vercel (en 2 minutes)

1. Créez un dépôt sur votre compte GitHub (ex: `solobar-pos`).
2. Poussez le code :
   ```bash
   git init
   git add .
   git commit -m "feat: SoloBar POS initial release"
   git branch -M main
   git remote add origin https://github.com/VOTRE_COMPTE/solobar-pos.git
   git push -u origin main
   ```
3. Rendez-vous sur [Vercel](https://vercel.com/) -> **Add New Project** -> Sélectionnez votre dépôt `solobar-pos`.
4. Cliquez sur **Deploy**. Grâce au fichier [`vercel.json`](./vercel.json), le routage SPA et le build Vite sont automatiquement configurés !

---

## 📜 Licence
MIT
