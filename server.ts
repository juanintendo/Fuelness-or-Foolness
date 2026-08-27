import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  getFieldNotes,
  getFieldNoteById,
  getExperiments,
  getExperimentById,
  getCases,
  getCaseById,
  getHypotheses,
  saveAgentRun,
  getRecentAgentRuns,
  getAgentRunById
} from './src/repositories';
import { runA01SeductionAnalyst, runA04FoolDetector } from './src/agents';
import { UserTier } from './src/utils/entitlements';
import { WorkbenchAnalysisResult } from './src/types';

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

  // Field Notes - List (Entitlement-Aware Sanitization via Repository)
  app.get('/api/field-notes', async (req, res) => {
    try {
      const tier = (req.query.tier as UserTier) || 'free';
      const now = new Date();
      const sanitizedNotes = await getFieldNotes(tier, now);
      res.json({ fieldNotes: sanitizedNotes });
    } catch (error) {
      console.error('[API] Error fetching field notes:', error);
      res.status(500).json({ error: 'Failed to retrieve field notes' });
    }
  });

  // Field Notes - Single Note by ID or Slug (Entitlement-Aware Sanitization via Repository)
  app.get('/api/field-notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const tier = (req.query.tier as UserTier) || 'free';
      const now = new Date();

      const note = await getFieldNoteById(id, tier, now);
      if (!note) {
        res.status(404).json({ error: 'Field note not found' });
        return;
      }

      res.json({ fieldNote: note });
    } catch (error) {
      console.error(`[API] Error fetching field note ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to retrieve field note' });
    }
  });

  // Experiments - List & Single (via Repository)
  app.get('/api/experiments', async (req, res) => {
    try {
      const experiments = await getExperiments();
      res.json({ experiments });
    } catch (error) {
      console.error('[API] Error fetching experiments:', error);
      res.status(500).json({ error: 'Failed to retrieve experiments' });
    }
  });

  app.get('/api/experiments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const experiment = await getExperimentById(id);
      if (!experiment) {
        res.status(404).json({ error: 'Experiment not found' });
        return;
      }
      res.json({ experiment });
    } catch (error) {
      console.error(`[API] Error fetching experiment ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to retrieve experiment' });
    }
  });

  // Cases - List & Single (via Repository)
  app.get('/api/cases', async (req, res) => {
    try {
      const cases = await getCases();
      res.json({ cases });
    } catch (error) {
      console.error('[API] Error fetching cases:', error);
      res.status(500).json({ error: 'Failed to retrieve cases' });
    }
  });

  app.get('/api/cases/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const caseStudy = await getCaseById(id);
      if (!caseStudy) {
        res.status(404).json({ error: 'Case study not found' });
        return;
      }
      res.json({ case: caseStudy });
    } catch (error) {
      console.error(`[API] Error fetching case ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to retrieve case study' });
    }
  });

  // Hypotheses - List (via Repository)
  app.get('/api/hypotheses', async (req, res) => {
    try {
      const hypotheses = await getHypotheses();
      res.json({ hypotheses });
    } catch (error) {
      console.error('[API] Error fetching hypotheses:', error);
      res.status(500).json({ error: 'Failed to retrieve hypotheses' });
    }
  });

  // --------------------------------------------------------------------------
  // A01 SEDUCTION ANALYST — ATTRACTION & ESCALATION AGENT ENDPOINTS (PHASE 5.1)
  // --------------------------------------------------------------------------

  // Execute A01 Seduction Analyst Run directly
  app.post('/api/agents/a01/run', async (req, res) => {
    try {
      const { interaction, text, subject, context, researchQuestion, userId } = req.body;
      const inputSnippet = interaction || text;

      if (!inputSnippet || typeof inputSnippet !== 'string') {
        res.status(400).json({ error: 'Interaction text snippet is required.' });
        return;
      }

      const client = getGeminiClient();
      const agentRun = await runA01SeductionAnalyst(
        {
          interaction: inputSnippet,
          subject: subject || 'Attraction & Tension Audit',
          context: context || 'Workbench Probe',
          researchQuestion: researchQuestion || 'What vectors of attraction, tension, and escalation are operating within the dialogue?',
          userId
        },
        { client, source: 'api_a01' }
      );

      // Persist artifact
      const savedRun = await saveAgentRun(agentRun);

      res.json({ agentRun: savedRun });
    } catch (error: any) {
      console.error('[API] Error in /api/agents/a01/run:', error);
      res.status(500).json({ error: error.message || 'A01 Seduction Analyst execution failed' });
    }
  });

  // Retrieve Recent A01 Agent Runs
  app.get('/api/agents/a01/runs', async (req, res) => {
    try {
      const count = parseInt(req.query.limit as string) || 15;
      const runs = await getRecentAgentRuns('A01', count);
      res.json({ runs });
    } catch (error: any) {
      console.error('[API] Error in /api/agents/a01/runs:', error);
      res.status(500).json({ error: 'Failed to retrieve agent runs' });
    }
  });

  // --------------------------------------------------------------------------
  // A04 FOOL DETECTOR — REFERENCE RESEARCH AGENT ENDPOINTS
  // --------------------------------------------------------------------------

  // Execute A04 Fool Detector Run directly
  app.post('/api/agents/a04/run', async (req, res) => {
    try {
      const { interaction, text, subject, context, researchQuestion, userId } = req.body;
      const inputSnippet = interaction || text;

      if (!inputSnippet || typeof inputSnippet !== 'string') {
        res.status(400).json({ error: 'Interaction text snippet is required.' });
        return;
      }

      const client = getGeminiClient();
      const agentRun = await runA04FoolDetector(
        {
          interaction: inputSnippet,
          subject: subject || 'Dialogue Audit',
          context: context || 'Workbench Probe',
          researchQuestion: researchQuestion || 'Are we fueling something real, or fooling ourselves?',
          userId
        },
        { client, source: 'api_a04' }
      );

      // Persist artifact
      const savedRun = await saveAgentRun(agentRun);

      res.json({ agentRun: savedRun });
    } catch (error: any) {
      console.error('[API] Error in /api/agents/a04/run:', error);
      res.status(500).json({ error: error.message || 'A04 Fool Detector execution failed' });
    }
  });

  // Retrieve Recent A04 Agent Runs
  app.get('/api/agents/a04/runs', async (req, res) => {
    try {
      const count = parseInt(req.query.limit as string) || 15;
      const runs = await getRecentAgentRuns('A04', count);
      res.json({ runs });
    } catch (error: any) {
      console.error('[API] Error in /api/agents/a04/runs:', error);
      res.status(500).json({ error: 'Failed to retrieve agent runs' });
    }
  });

  // Get specific agent run by ID
  app.get('/api/agents/runs/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const run = await getAgentRunById(id);
      if (!run) {
        res.status(404).json({ error: 'Agent run not found' });
        return;
      }
      res.json({ agentRun: run });
    } catch (error: any) {
      console.error(`[API] Error fetching run ${req.params.id}:`, error);
      res.status(500).json({ error: 'Failed to retrieve agent run' });
    }
  });

  // Interactive Lab Workbench Analysis API (Refactored to use A04 & Maintain Compatibility)
  app.post('/api/analyze', async (req, res) => {
    try {
      const { text, instrumentId, contextType, researchQuestion, subject, userId } = req.body;

      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text payload is required.' });
        return;
      }

      const client = getGeminiClient();
      const agentRun = await runA04FoolDetector(
        {
          interaction: text,
          context: contextType || 'Workbench Interactive Probe',
          subject: subject || (instrumentId ? `Probe: ${instrumentId}` : 'Workbench Probe'),
          researchQuestion: researchQuestion || 'Are we fueling something real, or fooling ourselves?',
          userId
        },
        { client, source: 'workbench' }
      );

      // Persist artifact
      await saveAgentRun(agentRun);

      const out = agentRun.output;

      // Transform into backwards-compatible WorkbenchAnalysisResult shape
      const result: WorkbenchAnalysisResult = {
        instrument: instrumentId || "Fool Detector (A04 // INST-04)",
        status: out.ruling === 'FOOLED' ? 'WARNING' : (out.ruling === 'INSUFFICIENT_EVIDENCE' ? 'ANOMALY' : 'SUCCESS'),
        fuelScore: out.fuelScore,
        foolScore: out.foolScore,
        frictionScore: out.frictionIndex,
        projectionProbability: out.foolScore,
        executiveDiagnosis: out.summary,
        signalsDetected: out.observations.map(obs => ({
          type: obs.epistemicStatus.replace('_', ' ').toUpperCase(),
          quoteSnippet: obs.evidence.slice(0, 60),
          interpretation: obs.interpretation,
          polarity: obs.epistemicStatus === 'empirical_finding' ? (out.fuelScore >= out.foolScore ? 'FUEL' : 'FOOL') : 'NEUTRAL'
        })),
        adversarialCounterpoint: out.foolSignals.length > 0 
          ? out.foolSignals.join(' • ') 
          : 'Fool Detector note: Maintain epistemic discipline and check for hidden sycophancy.',
        minaMarginalia: out.minaMarginalia || "If you want them to chase you, stop giving them a roadmap with turn-by-turn directions.",
        actionableRecommendation: out.recommendedNextAction,
        agentRunId: agentRun.id,
        ruling: out.ruling
      };

      res.json({ 
        result,
        agentRun
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
