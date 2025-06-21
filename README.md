# Frontend development guide

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ztWmcOvNxib)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide](https://vercel.com/wonderfulrichard123gmailcoms-projects/v0-frontend-development-guide)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/ztWmcOvNxib](https://v0.dev/chat/projects/ztWmcOvNxib)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

## API Documentation

This section describes how to interact with the backend API endpoints for the SnapDish application.

### 1. Query Dish Information

This endpoint is used to get detailed information (mocked) for a list of dish names. It's typically called after OCR processing has extracted dish names from a menu image.

*   **Endpoint:** `/api/query`
*   **Method:** `POST`
*   **Content-Type:** `application/json`

#### Request Body

The request body should be a JSON object containing an array of dish names.

*   `dishes` (array of strings): A list of dish names to query.

**Example Request:**

\`\`\`json
{
  "dishes": ["宫保鸡丁", "麻婆豆腐", "糖醋里脊"]
}
\`\`\`

#### Response Body

The response will be a JSON object containing an array of "cards", where each card represents a dish with its details.

*   `cards` (array of objects): A list of dish information objects. Each object has the following structure:
    *   `name` (string): The name of the dish.
    *   `rating` (number): A mock rating for the dish (between 4.0 and 5.0).
    *   `photoUrl` (string): A URL for a placeholder image of the dish.
    *   `summary` (string): A mock summary or description of the dish (in Chinese).

**Example Success Response (200 OK):**

\`\`\`json
{
  "cards": [
    {
      "name": "宫保鸡丁",
      "rating": 4.75,
      "photoUrl": "/placeholder.svg?height=300&width=300",
      "summary": "宫保鸡丁是一道经典菜品，口感丰富，营养价值高，深受食客喜爱。"
    },
    {
      "name": "麻婆豆腐",
      "rating": 4.21,
      "photoUrl": "/placeholder.svg?height=300&width=300",
      "summary": "麻婆豆腐是一道经典菜品，口感丰富，营养价值高，深受食客喜爱。"
    },
    {
      "name": "糖醋里脊",
      "rating": 4.93,
      "photoUrl": "/placeholder.svg?height=300&width=300",
      "summary": "糖醋里脊是一道经典菜品，口感丰富，营养价值高，深受食客喜爱。"
    }
  ]
}
\`\`\`

**Example Error Response (500 Internal Server Error):**

If an error occurs on the server:

\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

#### How to Integrate

To integrate with this API from a frontend application:

1.  **Collect Dish Names:** After processing a menu image (e.g., via OCR), gather the extracted dish names into an array.
2.  **Make a POST Request:** Send a `POST` request to the `/api/query` endpoint.
    *   Set the `Content-Type` header to `application/json`.
    *   Include the JSON payload (as shown in the example request) in the request body.
3.  **Handle the Response:**
    *   If the request is successful (status code 200), parse the JSON response to get the `cards` array.
    *   Use the data in the `cards` array to display dish information to the user.
    *   If the request fails, handle the error appropriately (e.g., display an error message).

**Example using `fetch` in JavaScript:**

\`\`\`javascript
async function fetchDishDetails(dishNames) {
  try {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dishes: dishNames }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Dish Details:', data.cards);
    // Process and display data.cards
    return data.cards;
  } catch (error) {
    console.error('Error fetching dish details:', error);
    // Handle error in UI
    return null;
  }
}

// Usage:
// const dishNamesFromOCR = ["宫保鸡丁", "麻婆豆腐"];
// fetchDishDetails(dishNamesFromOCR).then(cards => {
//   if (cards) {
//     // Update UI with cards
//   }
// });
\`\`\`

---
