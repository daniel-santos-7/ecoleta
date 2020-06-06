import { Router } from 'express';
import ItemCtrl from './controllers/ItemCtrl';
import PointCtrl from './controllers/PointCtrl';
import uploadsMiddlewares from './middlewares/uploads';
import validationsMiddlewares from './middlewares/validations';

const router = Router();

router.get('/item',ItemCtrl.index);
router.post('/point', uploadsMiddlewares.single('image'),validationsMiddlewares.Point(),PointCtrl.store);
router.get('/point/:id',PointCtrl.show);
router.get('/point',PointCtrl.index);

export default router;