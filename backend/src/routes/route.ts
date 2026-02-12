import express from "express";
import { createStore, deleteStore, getStores } from "../controller/store.controller";
//import { getStoreEvents } from "../controller/events.controller";

const router=express.Router();

router.post("/create",createStore);
router.delete("/delete/:id",deleteStore);
router.get("/stores",getStores);
//router.get("/events/:id",getStoreEvents);

export default router;