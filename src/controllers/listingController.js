import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createListing = asyncHandler( async (req, res, next) => {
    console.log("create a listing"); 



    try {
        let data = {...req.body}; 
        data.owner = {connect: {email: req.body.userEmail}}; 
        delete data.userEmail; 
        const listing = await prisma.listing.create({data}); 
        
        res.status(200).json({
            status: "Success",
            message: "Listing added successfully",
            data: listing
        })

    } catch (err) {
        if (err.code === "P2002") {
            res.status(409).json({
                status: "Error",
                message: "The listing already exists"
            })
        } else {
            res.status(409).json({
                status: "Error",
                message: err.message
            })
        }
    }
}); 

export const getAllListings = asyncHandler(async (req, res, next) => {
    const data = await prisma.listing.findMany({
        orderBy: {
            createdAt: "desc",
        }
    }); 
    res.status(200).json({
        status: "Success", 
        message: "Listings retrieved successfully",
        count: data.length,
        data
    })
})
export const getListing = asyncHandler(async (req, res, next) => {
    try {
        const data = await prisma.listing.findUnique({where: {id: req.params.id}}); 
        res.status(200).json({
            status: "Success", 
            message: "Listing retrieved successfully",
            data
        })
    } catch (err) {
        if (err) {
            res.status(404).json({
                status: "Error", 
                message: "Listing was not found",
            })
        }
    }
})