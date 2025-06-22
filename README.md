# Book Review Management API

## Description

Book Review Management API made up using Node.js, Express.js, MongoDB and Zod, which allows users to manage boooks and its reviews with average rating calculation.

## Features

Add and list books with filters (author, genre) and pagination

Add and get reviews for a book

Calculates and returns average rating per book

Input validation using Zod

## Tech Stack

- Node.js
- MongoDB
- Express.js
- Zod validator

## Setup Instructions

### Clone the repo

```bash
git clone https://github.com/Vinay14Newbie/Book-Review-Management-API.git
cd Book-Review-Management-API
```

### Install dependencies

```bash
    npm install
```

### Create .env File

```bash
 PORT=3000
 MONGO_URI=yourmongourisetup
 JWT_SECRET=yourSuperSecretKey
```

### Run teh server

```bash
    npm start
```
