import {Router} from 'express';

const router:Router = Router();

router.get('/',(req,res)=> {

    return res.json({msg:'test'});

});

export default router;