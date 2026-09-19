import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface ExplainRequest {
  topic: string;
  mode: 'simple' | 'beginner' | 'example' | 'quiz' | 'trap';
  context?: string;
  language?: 'fr' | 'en';
}

export async function handleExplainDifferently(req: ExplainRequest) {
  const { topic, mode, context, language = 'fr' } = req;
  const ai = getAiClient();

  if (!ai) {
    return {
      error: 'GEMINI_API_KEY is not configured on the server. Using local offline pedagogical engine.',
      isFallback: true,
    };
  }

  const isFr = language === 'fr';

  let modeInstruction = '';
  switch (mode) {
    case 'simple':
      modeInstruction = isFr
        ? 'Explique de manière synthétique, directe et accessible sans jargon superflu. Fournis 3 à 5 points clés clairs.'
        : 'Explain synthetically, directly and accessibly with no unnecessary jargon. Provide 3 to 5 clear key points.';
      break;
    case 'beginner':
      modeInstruction = isFr
        ? 'Explique comme à un grand débutant (ELI5) en utilisant une analogie concrète de la vie quotidienne (cuisine, déménagement, serrure, passeport, etc.) pour rendre le concept évident.'
        : 'Explain as if to a complete beginner (ELI5) using a concrete real-world analogy (cooking, moving, locks, passports, etc.) to make the concept intuitive.';
      break;
    case 'example':
      modeInstruction = isFr
        ? 'Fournis un exemple pratique complet dans un terminal Linux avec des commandes réelles, des commentaires pédagogiques et la décomposition pas à pas de chaque ligne.'
        : 'Provide a complete practical hands-on example in a Linux terminal with real commands, educational comments, and step-by-step breakdown.';
      break;
    case 'quiz':
      modeInstruction = isFr
        ? 'Crée une question de quiz à 4 choix pour tester la maîtrise de ce concept sur le modèle des examens officiels LPI, avec la bonne réponse et l\'explication détaillée.'
        : 'Create a 4-choice quiz question to test mastery of this concept following official LPI exam style, with the correct answer and detailed explanation.';
      break;
    case 'trap':
      modeInstruction = isFr
        ? 'Dévoile le grand piège classique des examens LPIC sur ce concept : ce qui fait tomber les candidats, les erreurs de confusion fréquentes, et la règle d\'or pour ne plus jamais se tromper.'
        : 'Reveal the classic LPIC exam trap on this concept: what tricks candidates, frequent confusions, and the golden rule to never get it wrong.';
      break;
  }

  const prompt = `Tu es un formateur expert pour les certifications Linux Professional Institute (LPI LPIC-1, LPIC-2, LPIC-3).
Concept ou commande à expliquer : "${topic}".
${context ? `Contexte supplémentaire de la question ou de l'objectif : "${context}".` : ''}
Mode demandé : "${mode}" (${modeInstruction}).
Langue demandée : ${isFr ? 'Français' : 'English'}.

Réponds STRICTEMENT sous forme d'un objet JSON avec la structure suivante :
{
  "title": "Titre du concept",
  "category": "Catégorie technique (ex: Permissions, Réseau, Stockage, Processus...)",
  "content": "Texte principal de l'explication (très bien formaté avec des retours à la ligne si nécessaire)",
  "keyPoints": ["Point clé 1", "Point clé 2", "Point clé 3"],
  "analogyTitle": "Titre de l'analogie (si mode beginner)",
  "analogyStory": "Histoire courte ou métaphore imagée (si mode beginner)",
  "terminalSnippet": "Commandes bash et résultats attendus (si mode example)",
  "quiz": {
    "question": "Énoncé de la question",
    "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
    "correctIndex": 0,
    "explanation": "Pourquoi cette réponse est correcte et les autres fausses"
  },
  "trapTitle": "Titre du piège d'examen (si mode trap)",
  "dangerLevel": "high",
  "howToAvoid": "La règle d'or pour éviter ce piège à l'examen (si mode trap)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err: any) {
    return {
      error: err?.message || 'Error generating AI explanation',
      isFallback: true,
    };
  }
}
