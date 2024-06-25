import express, { Request, Response } from 'express';
import cors from 'cors';
import { ORMType, getSchemaForORM } from '../orm/OrmHandler';
// import { getSchemaForORM } from './ormHandler';
// import { ORMType } from './types';

export function startServer(ormType: ORMType): void {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/schema', async (req: Request, res: Response) => {
    try {
      const schema = await getSchemaForORM(ormType);
      res.json(schema);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch schema' });
    }
  });

  const PORT = 5556;
  app.listen(PORT, () => {
    console.log(`Server running on <http://localhost>:${PORT}`);
    // Logic to open the frontend application
  });
}
