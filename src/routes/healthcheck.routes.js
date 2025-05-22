import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.contoller.js"

const router = Router();

router.route('/').get(healthcheck);

export default router