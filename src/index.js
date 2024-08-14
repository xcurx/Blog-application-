import dotenv from "dotenv"
import connectDB from "./db/index.db.js"
import { app } from "./app.js"

dotenv.config({path: './.env'})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running at Port:${process.env.PORT}`);
        console.log(`Visit: https://localhost:${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.log("Failed!!!",error);
})
