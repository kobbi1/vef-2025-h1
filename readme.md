# Hopverkefni 1
We decided to make a movie rental service, where USER role can rent movies, and the ADMIN role can add movies

# Team
Jakob Daníel Vigfússon

Omar Altabbaa

## Installation

```bash
npm install --force
```

## Usage
For now, you need to use something like postman to interact. since no frontend has been created, since we were told that we would be using react for frontend for Hopverkefni 2
### Authentication for user

**Admin Account Login Information:**
```bash
POST request: http://localhost:5050/auth/login
{
  "email": "admin@admin.com",
  "password": "hopverkefni1"
}
```

**Register**:
```bash
POST request: http://localhost:5050/auth/register
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Login**:
```bash
POST request: http://localhost:5050/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```
### Renting a movie

**Create a Rental**:
```bash
POST request: http://localhost:5050/rentals
{
  
  "userId": 1,
  "movieId": 2

}
```

**Get All Rentals**:
```bash

GET request: http://localhost:5050/rentals

```

**Get Rentals by User**:
```bash

GET request: http://localhost:5050/rentals/user/1

```

**Return a Movie**:
```bash

PUT request: http://localhost:5050/rentals/1/return

```
**Delete a Rental**:
```bash

DELETE request: http://localhost:5050/rentals/1

```

### Adding, Updating and Deleting movies

**Add Movie**
```bash
POST request: http://localhost:5050/movies
Must use admin login and get token, go to authorization and select Bearer Token
Go to body and use form data

Key             |   Type   | Value
============================================================================
title           |   Text   | The Shawshank Redemption
description     |   Text   | A banker convicted of...
releaseYear     |   Text   | 1994
poster          |   File   | Upload this from your PC (MUST BE JPEG OR PNG)
rentalPrice     |   Text   | 1000
availableCopies |   Text   | 10

```

**Delete Movie**
```bash
Must use admin login and get token, go to authorization and select Bearer Token

DELETE request: http://localhost:5050/movies/5
```

**Update Movie**
```bash
Must use admin login and get token, go to authorization and select Bearer Token

PUT request: http://localhost:5050/movies/1

{
    "description": "Very cool very nice, works yes yes"
}