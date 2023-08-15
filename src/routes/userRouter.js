import express from 'express'; 
import {
    createUser, 
    bookAndFavoriteListing, 
    getBookingsAndFavorites, 
    removeBookedAndFavorite} from "../controllers/userController.js"; 

const router = express.Router(); 


router.post("/register", createUser)
router.post("/:type/:id", bookAndFavoriteListing)
router.post("/:type", getBookingsAndFavorites)
router.post("/cancel/:type/:id", removeBookedAndFavorite)


export {router as userRouter}; 