// backend/src/routes/crypto.routes.ts
import { Router } from 'express';
import { cryptoController } from '../controllers/crypto.controller';

const router = Router();

router.get('/top', cryptoController.getTopCryptos);
router.get('/details/:id', cryptoController.getCryptoDetails);
router.post('/portfolio-prices', cryptoController.getPortfolioPrices);
router.get('/ws-status', cryptoController.getWebSocketStatus);

export default router;