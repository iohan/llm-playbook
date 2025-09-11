import { Router } from 'express';
import getAllTools from './get-all-tools';

const router = Router();

router.post('/get-all-tools', getAllTools);

export default router;
