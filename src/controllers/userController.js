import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createUser = asyncHandler( async (req, res, next) => {
    console.log("create a user"); 

    let {email} = req.body; 
    const userExists = await prisma.user.findUnique({where: {email}}); 

    if (!userExists) {
        const user = await prisma.user.create({data: req.body}); 
        res.status(200).json({
            stats: "Success",
            message: "User created successfully",
            data: user, 
        })
    } else {
        res.status(409).json({
            status: "Error",
            message: "User already registered!"
        })
    }
});

// book a visit & add to favorites

export const bookAndFavoriteListing = asyncHandler (async (req, res, next) => {
    const {email, date} = req.body; 
    const {id, type} = req.params; 

    try {
        let field = type === "bookings" ? "bookedVisits": "favListingsID"; 

        const arr = await prisma.user.findUnique({
            where: {email},
            select: {[field]: true}
        });
        if (arr[field].some(visit => (visit.id || visit) === id)) {
            res.status(400).json({
                status: "Error", 
                message: type === "bookings" ? "You have already placed the booking for this listing!":
                    "Listing is already in favorites"
            })
        } else {
            await prisma.user.update({
                where: {email}, 
                data: {
                    [field]: {push: type === "bookings" ? {id, date}: id}
                }
            });

            res.status(200).json({
                status: "Success",
                message: type === "bookings" ? "Listing has been booked successfully": "Listing added to favorites!"
            })
        }
    } catch (err) {
        console.log(err)
        if (err) return res.status(500).json({
            status: "Error",
            message: "Server error!"
        })
    }
})

// get all bookings & favorites

export const getBookingsAndFavorites = asyncHandler (async (req, res, next) => {
    try {
        let {type} = req.params; 
        let field = type === "bookings" ? "bookedVisits": "favListingsID"
        const data = await prisma.user.findUnique({where: {email: req.body.email}, select: {[field]: true}}); 
        res.status(200).json({
            status: "Success",
            data
        })
    } catch (err) {
        console.log(err)
        if (err) return res.status(500).json({
            status: "Error",
            message: "Server error!"
        })
    }
}); 

// cancel booking & remove from favorites
export const removeBookedAndFavorite = asyncHandler (async (req, res) => {
    const {email} = req.body; 
    const {id, type} = req.params; 

    try {
       
        let field = type === "bookings" ? "bookedVisits": "favListingsID"
        const user = await prisma.user.findUnique({where: {email}, select: {[field]: true}}); 
        const index = user[field].findIndex(visit => (visit.id || visit) === id); 

        if (index === -1) {
            res.status(400).json({
                status: "Error",
                message: type === "bookings" ? "Booking not found": "Listing not in favorites"
            })
        } else {
            user[field].splice(index, 1); 
            await prisma.user.update({
                where: {email},
                data: {
                    [field]: user[field]
                }
            }); 

            res.status(200).json({
                status: "Success",
                message: type === "bookings" ? "Booking canceled successfully!": "Listing has been removed from favorites!"
            })
        }

    } catch (err) {
        console.log(err)
        if (err) return res.status(500).json({
            status: "Error",
            message: "Server error!"
        })
    }
});


// adding residency to favorites
 