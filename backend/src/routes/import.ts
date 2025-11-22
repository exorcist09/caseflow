import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { handleUpload, handleChunkCreate } from '../controllers/importController';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 }});
const router = Router();

router.post('/upload', requireAuth, upload.single('file'), handleUpload);
router.post('/:importId/chunk', requireAuth, handleChunkCreate);

export default router;
