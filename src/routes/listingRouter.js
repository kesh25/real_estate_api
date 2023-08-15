import express from 'express'; 
import {createListing, getAllListings, getListing} from "../controllers/listingController.js"; 

const router = express.Router(); 


router.post("/create", createListing)
router.get("/", getAllListings)
router.get("/:id", getListing)


export {router as listingRouter}; 