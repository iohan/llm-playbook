import { Router } from 'express';
import getAllTools from './get-all-tools';
import toggleTool from './toggle-tool';

const router = Router();

router.post('/list-tools', getAllTools);
router.post('/toggle-tool', toggleTool);

export default router;
