# StockWisely - Stock Prediction Using ANN

## Overview

StockWisely is a web application built using the **MERN stack** (MongoDB, Express, React, Node.js) with **JWT and bcrypt authentication**. It leverages **Artificial Neural Networks (ANNs)** to predict stock prices with an accuracy of above 85%.

## Features

- **Stock Price Prediction**: Uses ANN to predict stock prices based on historical data.
- **User Authentication**: Secure sign-up, login, and session management using **JWT & bcrypt**.
- **Data Visualization**: Graphs comparing actual vs predicted stock prices.
- **Watchlist Feature**: Track and monitor favorite stocks.
- **Real-Time Data Fetching**: Retrieves stock data dynamically via APIs.
- **Secure Storage**: Data stored securely in MongoDB with authentication.
- **Modern UI**: Trendy design with animations using GSAP and Lenis.

## Tech Stack

- **Frontend**: React (JSX), Tailwind CSS, GSAP, Lenis
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & bcrypt
- **ML Model**: Artificial Neural Network (ANN)

## Installation

### Prerequisites

Ensure you have **Node.js**, **MongoDB**, and **yarn/npm** installed on your system.

### Clone the Repository

```sh
git clone https://github.com/yourusername/stockwisely.git
cd stockwisely
```

### Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the backend folder and add the following:

```sh
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

### Running the Application

#### Start the Backend Server

```sh
cd backend
npm start
```

#### Start the Frontend

```sh
cd frontend
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get authenticated user details

### Stock Prediction

- `POST /api/predict` - Predict stock price
- `GET /api/stock/:ticker` - Get stock data

### Watchlist

- `POST /api/watchlist` - Add stock to watchlist
- `GET /api/watchlist` - Get watchlist
- `DELETE /api/watchlist/:id` - Remove stock from watchlist

## Deployment

- **Frontend**: Deploy on Vercel/Netlify
- **Backend**: Deploy on Render/Heroku
- **Database**: Use MongoDB Atlas for cloud storage

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Add new feature"`
4. Push changes: `git push origin feature-branch`
5. Open a Pull Request

## License

This project is licensed under the **MIT License**.

## Contact

For any questions, reach out to **[miidelahrushikeshsai@gmail.com](mailto\:miidelahrushikeshsai@gmail.com)** or visit the repository's **Issues** section.

