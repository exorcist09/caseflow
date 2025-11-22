import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { listCases, getCase } from '../controllers/casesController';

const router = Router();

router.get('/', requireAuth, listCases);
router.get('/:id', requireAuth, getCase);

export default router;
