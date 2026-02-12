import { Request, Response } from "express";
import StoreEvent from "../models/storeEvent.model";

export const getStoreEvents = async (req: Request, res: Response) => {
  const storeId = req.params.id;

  const events = await StoreEvent.findAll({
    where: { storeId },
    order: [["createdAt", "DESC"]],
  });

  res.json(events);
};
