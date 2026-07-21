import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leadsRoutes from './routes/leads.routes.js';

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Rotas
app.use('/api/leads', leadsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[server] Rodando em http://localhost:${PORT}`);
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.warn('[server] GOOGLE_PLACES_API_KEY não definida — usando Nominatim como fonte primária');
  }
});
