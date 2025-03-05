import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


// Rent a movie (Create a Rental)
router.post("/", async (req, res) => {
    try {
        const { userId, movieId } = req.body;

        // Check if the movie is available
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        if (movie.availableCopies <= 0) {
            return res.status(400).json({ message: "No copies available for rent" });
        }

        // Create a rental
        const rental = await prisma.rental.create({
            data: {
                userId,
                movieId
            }
        });

        // Reduce available copies of the movie
        await prisma.movie.update({
            where: { id: movieId },
            data: { availableCopies: movie.availableCopies - 1 }
        });

        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ error: "Error creating rental", details: error.message });
    }
});

// Get all rentals
router.get("/", async (req, res) => {
    try {
        const rentals = await prisma.rental.findMany({
            include: { user: true, movie: true }
        });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ error: "Error fetching rentals", details: error.message });
    }
});

// Get rentals by user ID
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const rentals = await prisma.rental.findMany({
            where: { userId: parseInt(userId) },
            include: { movie: true }
        });
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user rentals", details: error.message });
    }
});

// Return a movie (Update rental status)
router.put("/:rentalId/return", async (req, res) => {
    try {
        const { rentalId } = req.params;

        const rental = await prisma.rental.findUnique({
            where: { id: parseInt(rentalId) }
        });

        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }

        if (rental.status === "RETURNED") {
            return res.status(400).json({ message: "Movie already returned" });
        }

        // Update rental status
        const updatedRental = await prisma.rental.update({
            where: { id: parseInt(rentalId) },
            data: { status: "RETURNED", returnDate: new Date() }
        });

        // Increase available copies of the movie
        await prisma.movie.update({
            where: { id: rental.movieId },
            data: { availableCopies: { increment: 1 } }
        });

        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(500).json({ error: "Error returning movie", details: error.message });
    }
});

// Delete a rental
router.delete("/:rentalId", async (req, res) => {
    try {
        const { rentalId } = req.params;

        const rental = await prisma.rental.findUnique({
            where: { id: parseInt(rentalId) }
        });

        if (!rental) {
            return res.status(404).json({ message: "Rental not found" });
        }

        await prisma.rental.delete({
            where: { id: parseInt(rentalId) }
        });

        res.status(200).json({ message: "Rental deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting rental", details: error.message });
    }
});

export default router;
