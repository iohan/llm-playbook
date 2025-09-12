import { Router } from 'express';
import getAllTools from './get-all-tools';

const router = Router();

router.post('/list-tools', getAllTools);

export default router;
