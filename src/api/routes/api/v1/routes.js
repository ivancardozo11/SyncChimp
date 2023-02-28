import { Router, Request, Response } from 'express';
import SyncContacts from '../../../controllers/syncController'

const router = Router();

router.get('/contacts/sync', SyncContacts);
export default router;