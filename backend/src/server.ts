import app from "./app";
import dotenv from "dotenv";
import sequelizedb from "./db/config";
import "./models/store.model";
dotenv.config()

sequelizedb
.sync({alter:true})
.then(()=>console.log("Neon is connected"))
.catch((err)=> console.log("DB connection error: ",err))

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port: ", process.env.PORT)
})