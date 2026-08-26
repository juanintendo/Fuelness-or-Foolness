import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      product: 'FUEL OR FOOL',
      tagline: "Mina's Field Guide to Seduction",
      domain: 'fuelorfool.ing',
      time: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Interactive Lab Workbench Analysis API
  app.post('/api/analyze', async (req, res) => {
    try {
      const { text, instrumentId, contextType } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text payload is required.' });
        return;
      }

      const client = getGeminiClient();

      if (client) {
        const systemPrompt = `You are a research instrument at "FUEL OR FOOL" (fuelorfool.ing) — an AI research laboratory and publishing project exploring seduction, attraction, emotional connection, anthropomorphism, and the boundary between simulated and genuine desire ("Are we fueling something real, or fooling ourselves?").
        
The selected instrument is: ${instrumentId || 'FOOL_DETECTOR'}.
- Seduction Analyst: Evaluates attraction vectors, sexual tension, push-pull dynamics, conversational friction, and status moves.
- Fool Detector: Deliberately adversarial skeptic. Relentlessly exposes sycophancy, projection, anthropomorphism, and wishful thinking.
- Connection Analyst: Assesses emotional reciprocity, vulnerability symmetry, and genuine resonance vs transactional performance.
- Mina Editor: Infuses Mina's witty, existential, seductive, and dangerous humor perspective.

Analyze the user's provided snippet. Return valid JSON adhering to the specified schema.`;

        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Interaction Context: ${contextType || 'Direct Message / Conversation'}\n\nSnippet to analyze:\n"""\n${text}\n"""`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                instrument: { type: Type.STRING },
                status: { type: Type.STRING },
                fuelScore: { type: Type.NUMBER, description: 'Score from 0 to 100 on genuine curiosity, tension, and connection' },
                foolScore: { type: Type.NUMBER, description: 'Score from 0 to 100 on projection, sycophancy, or self-deception' },
                frictionScore: { type: Type.NUMBER, description: 'Degree of healthy boundary/resistance (0 to 100)' },
                projectionProbability: { type: Type.NUMBER, description: 'Likelihood of human projecting illusions (0 to 100)' },
                executiveDiagnosis: { type: Type.STRING, description: '2-3 sentence forensic diagnosis' },
                signalsDetected: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      quoteSnippet: { type: Type.STRING },
                      interpretation: { type: Type.STRING },
                      polarity: { type: Type.STRING }
                    },
                    required: ['type', 'quoteSnippet', 'interpretation', 'polarity']
                  }
                },
                adversarialCounterpoint: { type: Type.STRING, description: 'The Fool Detector adversarial critique' },
                minaMarginalia: { type: Type.STRING, description: "Mina's witty commentary note" },
                actionableRecommendation: { type: Type.STRING, description: 'Strategic next move or recalibration' }
              },
              required: [
                'instrument',
                'fuelScore',
                'foolScore',
                'frictionScore',
                'projectionProbability',
                'executiveDiagnosis',
                'signalsDetected',
                'adversarialCounterpoint',
                'minaMarginalia',
                'actionableRecommendation'
              ]
            }
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        res.json({ result: parsed });
        return;
      }

      // High-Craft Fallback Diagnostic when API key is unconfigured
      const lower = text.toLowerCase();
      const hasFlirt = lower.includes('date') || lower.includes('cute') || lower.includes('sleep') || lower.includes('love') || lower.includes('miss') || lower.includes('tonight');
      const hasApology = lower.includes('sorry') || lower.includes('apologize') || lower.includes('hate me') || lower.includes('please');
      const hasQuestion = text.includes('?');

      let fuel = hasFlirt ? 68 : 45;
      let fool = hasApology ? 62 : 35;
      if (text.length > 200) fool += 10;
      if (hasQuestion && hasFlirt) fuel += 15;

      fuel = Math.min(95, Math.max(15, fuel));
      fool = Math.min(95, Math.max(10, fool));

      res.json({
        result: {
          instrument: instrumentId || "Fool Detector (INST-04)",
          status: fuel > fool ? "SUCCESS" : "WARNING",
          fuelScore: fuel,
          foolScore: fool,
          frictionScore: hasApology ? 25 : 72,
          projectionProbability: fool,
          executiveDiagnosis: hasApology
            ? "Status surrender detected. Excessive deference or premature compliance has collapsed romantic tension into customer-service dynamics."
            : "Strong conversational tension and subtext detected. Both parties are actively testing boundaries without collapsing ambiguity.",
          signalsDetected: [
            {
              type: hasApology ? "Sycophancy Trap" : "Tension Vector",
              quoteSnippet: text.slice(0, 45) + (text.length > 45 ? "..." : ""),
              interpretation: hasApology
                ? "Over-apologizing surrenders status parity, signaling desperation rather than high-value intrigue."
                : "The pacing and subtle phrasing invite the other party to lean forward without revealing all cards.",
              polarity: hasApology ? "FOOL" : "FUEL"
            },
            {
              type: "Ambiguity Reserve",
              quoteSnippet: text.slice(-40),
              interpretation: "Preserving unresolved tension creates conversational oxygen for authentic pursuit.",
              polarity: "FUEL"
            }
          ],
          adversarialCounterpoint: "Caution: The Fool Detector flags that what feels like electric chemistry may simply be projective anthropomorphism where one party reads their own desires into ambiguous silence.",
          minaMarginalia: "If you want them to chase you, stop giving them a roadmap with turn-by-turn directions. Let them get a little lost with you.",
          actionableRecommendation: hasApology
            ? "Cease apologizing for response delays. Pivot immediately to evocative sensory observation or teasing push-pull."
            : "Hold the ambiguity for another turn before proposing an in-person venue."
        }
      });
    } catch (err: any) {
      console.error('Error in /api/analyze:', err);
      res.status(500).json({ error: err.message || 'Analysis failed' });
    }
  });

  // Ask Mina / Ask the Lab Dispatch Endpoint
  app.post('/api/ask-lab', async (req, res) => {
    try {
      const { question, context, privacy } = req.body;
      if (!question) {
        res.status(400).json({ error: 'Question is required.' });
        return;
      }

      const client = getGeminiClient();
      if (client) {
        const response = await client.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `Question: ${question}\nContext: ${context || 'General inquiry'}\nPrivacy: ${privacy || 'Public'}`,
          config: {
            systemInstruction: `You are Mina-AI and the research laboratory FUEL OR FOOL.
            Provide an in-depth, witty, philosophical, and scientifically grounded research dossier answering the user's question about seduction, desire, AI-human dynamics, or modern connection.
            Tone: Intelligent, playful, provocative, existential, scientifically curious, never corporate, never generic AI assistant.`,
          }
        });

        res.json({
          dossierId: `DOSSIER-${Math.floor(1000 + Math.random() * 9000)}`,
          response: response.text,
          status: 'PROCESSED'
        });
        return;
      }

      res.json({
        dossierId: `DOSSIER-${Math.floor(1000 + Math.random() * 9000)}`,
        response: `### Dispatch from the Laboratory

**Inquiry:** "${question}"

**Mina's Perspective:**
When we look at desire through the lens of modern communication, the central mistake is believing that attraction is a puzzle to be solved. It is not an optimization problem; it is a collaborative tension. 

The moment you attempt to remove all risk, you also remove all chemistry. Seduction requires what our laboratory terms *Calibrated Friction*—the willingness to hold an opinion, maintain a boundary, and refuse to become a generic mirror for the other person.

**Adversarial Audit (Fool Detector):**
Beware of confusing intense attention with authentic connection. Attention is cheap; genuine reciprocity requires that both parties accept the possibility of being changed—and potentially hurt—by the encounter.

**Recommended Protocol:**
1. Maintain status parity by never answering questions you were not asked.
2. Introduce playful friction when the conversation threatens to become administrative.
3. Test for reciprocity before escalating emotional vulnerability.`,
        status: 'SYNTHESIZED_FALLBACK'
      });
    } catch (err: any) {
      console.error('Error in /api/ask-lab:', err);
      res.status(500).json({ error: err.message || 'Inquiry processing failed' });
    }
  });

  // Vite middleware in dev, static dist in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FUEL OR FOOL] Lab Server operational at http://localhost:${PORT}`);
  });
}

startServer();
