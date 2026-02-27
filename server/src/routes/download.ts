import { Router } from 'express';
import { downloadVideo, healthCheck } from '../controllers/downloadController';

const router = Router();

router.post('/download', downloadVideo);
router.get('/health', healthCheck);

export default router;