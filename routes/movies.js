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
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const pageSize = 10;
  
      const [movies, totalCount] = await Promise.all([
        prisma.movie.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.movie.count(),
      ]);
  
      const totalPages = Math.ceil(totalCount / pageSize);
  
      // ✅ This is the correct shape your frontend expects
      return res.json({
        data: movies,
        meta: {
          page,
          totalPages,
          pageSize,
          totalCount,
        },
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
  
  /**
   * Get all movies
   */
  router.get("/all", async (req, res) => {
    try {
      const movies = await prisma.movie.findMany();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
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
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid movie ID" });
      }
  
      const {
        title,
        description,
        releaseYear,
        rentalPrice,
        availableCopies,
      } = req.body;
  
      // Safely parse numeric values (only if present)
      const parsedReleaseYear = releaseYear ? parseInt(releaseYear, 10) : undefined;
      const parsedRentalPrice = rentalPrice ? parseFloat(rentalPrice) : undefined;
      const parsedAvailableCopies = availableCopies ? parseInt(availableCopies, 10) : undefined;
  
      const posterUrl = req.file ? req.file.path : undefined;
  
      // Only include fields that are defined
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(parsedReleaseYear && { releaseYear: parsedReleaseYear }),
        ...(parsedRentalPrice && { rentalPrice: parsedRentalPrice }),
        ...(parsedAvailableCopies && { availableCopies: parsedAvailableCopies }),
        ...(posterUrl && { posterUrl }),
      };
  
      const updatedMovie = await prisma.movie.update({
        where: { id },
        data: updateData,
      });
  
      return res.json(updatedMovie);
    } catch (error) {
      console.error("Error updating movie:", error);
      return res.status(500).json({ error: "Internal server error" });
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
