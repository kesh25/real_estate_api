import express from "express"; 
import dotenv from 'dotenv'; 
import cookieParser from 'cookie-parser'; 
import cors from "cors"; 
import { userRouter } from "./src/routes/userRouter.js";
import { listingRouter } from "./src/routes/listingRouter.js";



dotenv.config(); 

const app = express(); 
const PORT  = process.env.PORT || 5000; 

app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors()); 


// routes
app.use("/api/users", userRouter)
app.use("/api/listings", listingRouter)




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})