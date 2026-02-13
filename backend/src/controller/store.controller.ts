import Store from "../models/store.model";
import { Request,Response } from "express";
import uuid4 from "uuid4";
import { deleteStoreWorker, provisionStore } from "./asyncWorker";
import { error } from "console";
export const createStore= async(req: Request,res:Response)=>{
    try {
        const {engine }=req.body

        if(engine!=="woocommerce" && engine!=="medusa"){
            return res.status(400).json({
                error:"Engine value choosen wrong"
            })

        }

        //generate meta data values
        const storeId=uuid4();

        //insert them to database first
        const store=await Store.create(
            {
                id:storeId,
                engine,
                namespace:`store-${storeId}`,
                helmRelease: `store-${storeId}`,
                url:null,
                status:"PROVISIONING"
            }
        )
        console.log("Data inserted")
         //frontend will recieve data
        res.status(201).json(store)
        console.log("Status provisioning...")


        //async provision using a background worker
        setImmediate(()=>{
            provisionStore(store.id);
        })
        //The background worker will invoke helm and monitor provisionsing this means
        // it will periodically check helm status if ready healthy then Updates the database values with the generated url and shows in the frontend immidietly
        // if failed then status is changed to failed and clean up will start
    } catch (error) {
        res.status(500).json({
            "error":"Server error"
        })
        console.log(error)
    }
}

export const deleteStore= async(req:Request,res:Response)=>{
    try {
        const id= req.params.id as string;

        const store=await Store.findByPk(id);
        if(!store){
            return res.status(404).json({
                error:"Store not found"
            })
        }

        if(store.status==="DELETING"){
            return res.status(409).json({ error: "Store already deleting" });
        }
        await Store.update(
            {status: "DELETING"},
         {where: {id} }
        );
        res.status(202).json({
            message:"Store deleted"
        });
        setImmediate(()=>{
            deleteStoreWorker(id);
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete store" });
    }
}
export const getStores = async (_req: Request, res: Response) => {
  try {
    const stores = await Store.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stores" });
  }
};