import { Router } from 'express';
import ItemCtrl from './controllers/ItemCtrl';
import PointCtrl from './controllers/PointCtrl';

const router = Router();

router.get('/item',ItemCtrl.index);
router.post('/point',PointCtrl.store);
router.get('/point/:id',PointCtrl.show);
router.get('/point',PointCtrl.index);

export default router;