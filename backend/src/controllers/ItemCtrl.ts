import { Request, Response } from 'express';
import db from '../database/connection';

class ItemCtrl {

    public async index(req: Request, res: Response): Promise<Response> {

        try {

            const items = await db('items').select('*');

            const serializedItems = items.map(item=> ({
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`
            }));

            return res.json(serializedItems);

        } catch(err) {

            return res.status(500).json({ message: 'server error' });
        
        }
    
    }

}

export default new ItemCtrl();