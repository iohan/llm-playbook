import { Router } from 'express';
import getProviders from './get-providers';

const router = Router();
router.post('/get-providers', getProviders);

export default router;
