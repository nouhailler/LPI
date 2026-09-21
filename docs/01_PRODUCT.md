# 01 — Spécification Produit (Product Vision & Scope)

> Ce document définit la vision fonctionnelle, le public cible, la valeur d'usage et la cartographie d'avancement du produit **LPI Certification Prep**.

---

## 1. Positionnement Produit

**LPI Certification Prep** est la plateforme de référence **offline-first** pour l'apprentissage, l'entraînement pratique et la préparation aux examens de certification du **Linux Professional Institute (LPI)**.

Elle se distingue radicalement des banques de questions classiques (dumps passifs) en proposant un écosystème d'ateliers interactifs et un moteur de terminal Unix simulé permettant d'acquérir de véritables automatismes système.

---

## 2. Publics Cibles (Personas)

| Profil | Besoins Clés | Fonctionnalités Clés Utilisées |
| :--- | :--- | :--- |
| **Candidat LPIC-1 (101 & 102)** | Débutant à intermédiaire. Doit maîtriser les commandes de base, les permissions, la gestion de disques, les services et le réseau local. | Flashcards SRS, Ateliers Fill-in-the-blank, Terminal Virtuel (exercices `chmod`, `grep`, `tar`). |
| **Candidat LPIC-2 (201 & 202)** | Administrateur système expérimenté. Approfondissement du noyau, stockage avancé (LVM, RAID), serveurs réseau (BIND, Apache, Samba, Postfix). | Practice Exams 201/202, Scénarios d'incident DNS/Mail, Analyse de pannes noyau et boot. |
| **Candidat LPIC-3 (300, 303, 305, 306)** | Spécialiste Senior Linux (Environnements Mixtes, Sécurité, Virtualisation & Cloud, Haute Disponibilité). | Modules de spécialité LPIC-3, questions avancées de sécurité (SELinux, AppArmor, OpenSSL, iptables/nftables). |
| **Administrateur en Poste / Recyclage** | Professionnel souhaitant rafraîchir ses connaissances avant un entretien technique ou une migration d'infrastructure. | Diagnostics rapides, Training Hub (Incident Response), Glossaire & fiches commandes. |
| **Étudiant / Autodidacte Linux** | Pratiquant sans accès à un environnement Linux dédié (ex: machine verrouillée, tablette, déplacement). | Simulateur de Terminal 100% PWA dans le navigateur, sans installation de machine virtuelle. |

---

## 3. Matrice de Maturité Fonctionnelle

Pour garantir l'intégrité de la documentation et éviter tout décalage entre les intentions et la réalité du code, chaque fonctionnalité est formellement classée selon trois statuts :

- **✅ EXISTANT** : Fonctionnalité entièrement développée, testée, présente dans le code source et accessible dans l'application.
- **🔄 PLANIFIÉ** : Fonctionnalité architecturalement prévue (types, abstractions ou maquettes prêtes), priorisée dans la roadmap.
- **🧪 EXPÉRIMENTAL** : Fonctionnalité exploratoire, prototype ou intégration optionnelle nécessitant une clé ou un service externe.

---

### Tableau Détaillé des Fonctionnalités

| Module | Fonctionnalité | Statut | Description & Périmètre Actuel |
| :--- | :--- | :---: | :--- |
| **Core & Nav** | Navigation & Dashboard | ✅ EXISTANT | Menu latéral catégorisé, score global, métriques d'apprentissage, sélecteur de mode. |
| **Core & Nav** | Internationalisation (i18n) | ✅ EXISTANT | Bilinguisme intégral Français / Anglais avec basculement instantané sans rechargement. |
| **Core & Nav** | Mode PWA & Offline | ✅ EXISTANT | Installation sur bureau/mobile, Service Worker, cache complet des données et assets. |
| **Learning** | Curriculum LPIC-1, 2, 3 | ✅ EXISTANT | Arborescence complète des objectifs officiels avec pondération et sous-objectifs. |
| **Learning** | Parcours Thématiques | ✅ EXISTANT | Regroupements pédagogiques transverses (ex: Réseau, Sécurité, Stockage). |
| **Learning** | Glossaire & Command Index | ✅ EXISTANT | Index complet des commandes Linux avec filtres par catégorie, options courantes et exemples. |
| **Learning** | Pédagogie des Commandes | ✅ EXISTANT | Décomposition visuelle des commandes (binaire, drapeaux courts/longs, arguments, pipes). |
| **Flashcards** | Algorithme SRS Leitner/SM-2 | ✅ EXISTANT | Répétition espacée avec gestion des statuts (*new, learning, review, mastered*), calcul des lapses et dates d'échéance. |
| **Flashcards** | Deck de 2 000+ Cartes | ✅ EXISTANT | Cartes couvrant l'ensemble des topics LPIC-1 (101-110), LPIC-2 (201-212) et LPIC-3. |
| **Practice** | Examens Chronométrés | ✅ EXISTANT | Simulateur d'examen 60 questions / 90 minutes avec minuteur, marquage de questions et calcul du score. |
| **Practice** | Tolérance Syntaxique | ✅ EXISTANT | Évaluation intelligente des commandes saisies (insensibilité aux espaces, ordre des flags, alias équivalents). |
| **Practice** | Examen Diagnostique Initial | ✅ EXISTANT | Évaluation de départ générant une matrice de compétences pour personnaliser l'apprentissage. |
| **Analytics** | Weakness Engine | ✅ EXISTANT | Calcul dynamique des lacunes par domaine, identification des erreurs récurrentes et suggestions d'ateliers. |
| **Analytics** | Readiness Score | ✅ EXISTANT | Indicateur de probabilité de réussite à l'examen officiel basé sur les performances consolidées. |
| **Training** | Terminal Virtuel (VirtualFS) | ✅ EXISTANT | Filesystem virtuel en mémoire (`/home`, `/etc`, `/var/log`), shell Bash 5.2 simulé et validation d'état. |
| **Training** | Incident Response | ✅ EXISTANT | Simulation d'astreinte en temps limité avec scénarios de pannes système réalistes. |
| **Training** | Ateliers Fill-in-the-blank | ✅ EXISTANT | Questions de saisie de commandes sans choix multiple avec feedback immédiat. |
| **Training** | Ateliers Dépannage & Pannes | ✅ EXISTANT | Analyse de messages d'erreurs réels (dmesg, journalctl, syslog) et résolution. |
| **Training** | Séquençage Chronologique | ✅ EXISTANT | Ordonnancement par glisser-déposer des étapes critiques (boot UEFI/GRUB, flux de paquets réseau). |
| **Training** | Jeux d'Association | ✅ EXISTANT | Exercices de correspondance rapide entre commandes, fichiers de configuration et protocoles. |
| **Career** | Certification Path | ✅ EXISTANT | Guide interactif des certifications LPI, prérequis, durée de validité et conseils d'examen. |
| **AI / Tutor** | "Expliquer Différemment" | 🧪 EXPÉRIMENTAL | Reformulation d'un concept via l'API Gemini (analogies, schéma textuel, vulgarisation) avec fallback local. |
| **Labs V2** | Conteneurs Dédiés (Docker/Wasm) | 🔄 PLANIFIÉ | Exécution d'un vrai noyau Linux via WebAssembly (v86/WebContainers) pour supporter systemd réel. |
| **Sync** | Synchronisation Multi-appareils | 🔄 PLANIFIÉ | Export/import JSON chiffré et synchronisation cloud optionnelle pour retrouver son avancement partout. |
| **Desktop** | Version Electron / Tauri | 🔄 PLANIFIÉ | Package natif intégrant un démon Linux local pour des labs avancés avec accès matériel/réseau réel. |
