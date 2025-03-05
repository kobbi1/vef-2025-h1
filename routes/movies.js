import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 *  Get all movies (paginated)
 */
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const movies = await prisma.movie.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        return res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Get a single movie by ID
 */
router.get("/:id", async (req, res) => {
    try {
        const movie = await prisma.movie.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!movie) {
            return res.status(404).json({ error: "Movie not found" });
        }

        return res.json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Add a new movie with image upload (Admin only)
 */
router.post("/", authenticate, isAdmin, upload.single("poster"), async (req, res) => {
    try {
        let { title, description, releaseYear, rentalPrice, availableCopies } = req.body;

        if (!title || !description || !releaseYear || !rentalPrice || !availableCopies) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        releaseYear = parseInt(releaseYear, 10);
        rentalPrice = parseFloat(rentalPrice);
        availableCopies = parseInt(availableCopies, 10);

        console.log("Uploaded file info:", req.file); // ✅ Debugging info

        // ✅ If a file is uploaded, save its Cloudinary URL
        const posterUrl = req.file ? req.file.path : null;

        const newMovie = await prisma.movie.create({
            data: { title, description, releaseYear, posterUrl, rentalPrice, availableCopies }
        });

        return res.status(201).json(newMovie);
    } catch (error) {
        console.error("Error creating movie:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Update a movie with optional image upload (Admin only)
 */
router.put("/:id", authenticate, isAdmin, upload.single("poster"), async (req, res) => {
    try {
        const { title, description, releaseYear, rentalPrice, availableCopies } = req.body;

        const posterUrl = req.file ? req.file.path : undefined;

        const updatedMovie = await prisma.movie.update({
            where: { id: parseInt(req.params.id) },
            data: { title, description, releaseYear, posterUrl, rentalPrice, availableCopies }
        });

        return res.json(updatedMovie);
    } catch (error) {
        console.error("Error updating movie:", error);
        return res.status(404).json({ error: "Movie not found" });
    }
});

/**
 *  Delete a movie (Admin only)
 */
router.delete("/:id", authenticate, isAdmin, async (req, res) => {
    try {
        await prisma.movie.delete({
            where: { id: parseInt(req.params.id) }
        });

        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting movie:", error);
        return res.status(404).json({ error: "Movie not found" });
    }
});

export default router;
