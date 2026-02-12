import StoreEvent from "../models/storeEvent.model";

export async function logEvent(storeId: string,
    type: string,
    message: string
) {
    try{
        await StoreEvent.create({
            storeId,
            type,
            message,
        });
    }
    catch(err){
        console.log("Failed to log", err);
    }    
}