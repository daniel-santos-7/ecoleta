import { Request, Response, request } from 'express';
import db from '../database/connection';

class PointController {

    public async store(req: Request, res: Response) {

        try {

            const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body;

            const newPoint = {
                image: req.file.filename,
                name,
                email,
                whatsapp,
                latitude,
                longitude,
                city,
                uf
            };

            const trx = await db.transaction();

            const [point_id] = await trx('points').insert(newPoint);

            const pointItems = items.split(',')
            .map((item:string)=> Number(item.trim()))
            .map((item_id:number)=> ({
                item_id,
                point_id
            }));

            await trx('point_items').insert(pointItems);

            await trx.commit();

            return res.json({ id:point_id, ...newPoint });
        
        } catch(err) {

            return res.status(500).json({ message:'server error' });
        
        }
    
    }

    async show(req: Request, res: Response) {

        try {
        
            const { id } = req.params;

            const point = await db('points').where('id',id).first();

            if(!point) {

                return res.status(400).json({ message: 'point not found' });

            }

            const items = await db('items').join('point_items','items.id','=','point_items.item_id').where('point_items.point_id',id).select('items.title');

            return res.json({...point, items});
        
        } catch(err) {

            return res.status(500).json({message:'server error'});

        }

    }

    async index(req :Request, res: Response) {

        try {
    
            const { city, uf, items } = req.query;

            const parsedItems = String(items).split(',').map(item=> Number(item.trim()));

            const points = await db('points')
            .join('point_items','points.id','=','point_items.point_id')
            .whereIn('point_items.item_id',parsedItems)
            .where('city',String(city))
            .where('uf',String(uf))
            .select('points.*')
            .distinct();

            return res.json(points);

        } catch (err) {

            return res.status(500).json({ message:'server error' });

        }

    }

}

export default new PointController();