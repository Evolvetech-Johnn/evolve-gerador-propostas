import express from 'express';
import { buscarLeads, enriquecerCnpj } from '../controllers/leads.controller.js';

const router = express.Router();

// GET /api/leads/buscar?nicho=&cidade=&estado=&avaliacaoMinima=&minimoAvaliacoes=&exigirTelefone=&exigirSite=
router.get('/buscar', buscarLeads);

// POST /api/leads/enriquecer-cnpj  body: { cnpj }
router.post('/enriquecer-cnpj', enriquecerCnpj);

export default router;
