import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import rentalRoutes from "./routes/rentals.js";
//import reviewRoutes from "./routes/reviews.js";
//import transactionRoutes from "./routes/transactions.js";
//import watchlistRoutes from "./routes/watchlist.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/rentals", rentalRoutes);
//app.use("/reviews", reviewRoutes);
//app.use("/transactions", transactionRoutes);
//app.use("/watchlist", watchlistRoutes);

app.get("/", (req, res) => {
    res.json({ message: ["Welcome to the Movie Rental API by Jakob Daníel Vigfússon and Omar Altabbaa","Keep in mind, there are no GET endpoints for auth", "Look at the Github readme on how to create,update and remove rentals/movies/accounts", "The /movies only shows 10 json responses as wanted in the assignment, however there are 50 movies, just check /movies/50"], endpoints: ["/auth/register", "/auth/login", "/movies","/movies/1", "/rentals","/rentals/user/1"], githubLink: "https://github.com/kobbi1/vef-2025-h1" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
