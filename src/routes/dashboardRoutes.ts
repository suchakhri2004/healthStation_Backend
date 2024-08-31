import { Router } from 'express';
import { ifnotRoleADMIN } from '../authen/authMiddleware';
import { dashboard,insertedMap,dashboardMap } from '../controllers/dashboardController';

const router = Router();

router.get('/dashboard',ifnotRoleADMIN, dashboard);
router.get('/dashboardMap',ifnotRoleADMIN, dashboardMap);
router.post('/insertedMap',ifnotRoleADMIN, insertedMap);

export default router;
