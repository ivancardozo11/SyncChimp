import { Request, Response } from 'express';
import syncService from '../services/syncService';

const syncContacts = async (req: Request, res: Response) => {
  try {
    const syncedContacts = await syncService();
    const response = {
      success: true,
      data: syncedContacts,
    };
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export default syncContacts;
