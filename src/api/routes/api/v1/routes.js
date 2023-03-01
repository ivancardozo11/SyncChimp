import { Router } from 'express';
import syncContacts from '../../../controllers/syncController.js'


const router = Router();

router.get('/contacts/sync', syncContacts);
export default router;