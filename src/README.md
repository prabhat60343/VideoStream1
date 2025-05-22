# Backend Project

This is a backend project for a video streaming platform. It provides APIs for user authentication, video management, subscriptions, playlists, likes, comments, and more.

## Features

- **User Management**: User registration, login, logout, and profile updates.
- **Video Management**: Upload, update, delete, and fetch videos with support for search, sort, and pagination.
- **Subscriptions**: Subscribe/unsubscribe to channels and manage subscriptions.
- **Playlists**: Create, update, delete, and manage playlists and their videos.
- **Likes and Comments**: Like/unlike videos, tweets, and comments, and manage comments.
- **Tweets**: Create, update, delete, and fetch tweets.
- **Dashboard**: Channel statistics and video analytics.
- **Authentication**: JWT-based authentication with access and refresh tokens.
- **Healthcheck**: API to check the health of the server.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: Database for storing data.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: For file uploads.
- **JWT**: For authentication.
- **Multer**: For handling file uploads.
- **dotenv**: For environment variable management.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure it based on `.env.sample`.

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### User Routes
- `POST /api/v1/users/register`: Register a new user.
- `POST /api/v1/users/login`: Login a user.
- `POST /api/v1/users/logout`: Logout a user.
- `GET /api/v1/users/current-user`: Get the current logged-in user.

### Video Routes
- `GET /api/v1/videos`: Get all videos (supports search, sort, pagination).
- `POST /api/v1/videos`: Upload a new video.
- `GET /api/v1/videos/:videoId`: Get video details by ID.
- `PATCH /api/v1/videos/:videoId`: Update video details.
- `DELETE /api/v1/videos/:videoId`: Delete a video.
- `PATCH /api/v1/videos/:videoId/toggle-publish`: Toggle publish status.

### Subscription Routes
- `POST /api/v1/subscriptions/c/:channelId`: Subscribe/unsubscribe to a channel.
- `GET /api/v1/subscriptions/c/:channelId`: Get subscribers of a channel.
- `GET /api/v1/subscriptions/u/:subscriberId`: Get channels a user has subscribed to.

### Playlist Routes
- `POST /api/v1/playlist`: Create a new playlist.
- `GET /api/v1/playlist/user/:userId`: Get playlists of a user.
- `GET /api/v1/playlist/:playlistId`: Get playlist details.
- `PATCH /api/v1/playlist/:playlistId`: Update a playlist.
- `DELETE /api/v1/playlist/:playlistId`: Delete a playlist.
- `POST /api/v1/playlist/:playlistId/video/:videoId`: Add video to playlist.
- `DELETE /api/v1/playlist/:playlistId/video/:videoId`: Remove video from playlist.

### Like Routes
- `POST /api/v1/likes/toggle/v/:videoId`: Toggle like on a video.
- `POST /api/v1/likes/toggle/c/:commentId`: Toggle like on a comment.
- `POST /api/v1/likes/toggle/t/:tweetId`: Toggle like on a tweet.
- `GET /api/v1/likes/videos`: Get all liked videos of the current user.

### Comment Routes
- `GET /api/v1/comments/:videoId`: Get comments for a video.
- `POST /api/v1/comments/:videoId`: Add a comment to a video.
- `PATCH /api/v1/comments/:commentId`: Update a comment.
- `DELETE /api/v1/comments/:commentId`: Delete a comment.

### Tweet Routes
- `POST /api/v1/tweets`: Create a tweet.
- `GET /api/v1/tweets/:userId`: Get tweets by user.
- `PATCH /api/v1/tweets/:tweetId`: Update a tweet.
- `DELETE /api/v1/tweets/:tweetId`: Delete a tweet.

### Dashboard
- `GET /api/v1/dashboard/stats`: Get channel statistics.
- `GET /api/v1/dashboard/videos`: Get all videos uploaded by the channel.

### Healthcheck
- `GET /api/v1/healthcheck`: Check server health.

## Folder Structure

```plaintext
backend-project/
├── src/
│   ├── controllers/       # API controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── middlewares/       # Middleware functions
│   ├── db/                # Database connection
│   ├── app.js             # Express app setup
│   ├── index.js           # Entry point
├── public/                # Public assets
├── .env.sample            # Environment variable sample
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation
```

## Environment Variables

The following environment variables are required:

- `PORT`: Server port.
- `MONGODB_URI`: MongoDB connection string.
- `ACCESS_TOKEN_SECRET`: Secret for JWT access tokens.
- `REFRESH_TOKEN_SECRET`: Secret for JWT refresh tokens.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

## Best Practices & Recommendations

To ensure server stability and maintainability, keep in mind the following:

- **Always validate ObjectIds** before querying the database to prevent casting errors.
- **Consistent error handling:** Use a global error handler middleware to catch and respond to errors from controllers.
- **Authorization:** Ensure update/delete operations verify resource ownership (`owner: userId`) for security.
- **Check referenced documents:** When adding/removing references (e.g., videos in playlists), optionally verify the referenced document exists.
- **File upload middleware:** Ensure file upload middleware (like `multer` or `express-fileupload`) is applied to relevant routes.
- **Populate references carefully:** Make sure referenced fields in `.populate()` exist and are correctly set up in Mongoose schemas.
- **Consistent return values:** Standardize responses for similar operations (e.g., delete operations).
- **Type conversion for pagination:** Convert `page` and `limit` query params to numbers before calculations.
- **Model definitions:** Double-check models for required fields, correct references (`ref`), and necessary indexes.

Following these practices will help prevent runtime issues and server instability.

## License

This project is licensed under the ISC License.

## Backend Integration Details for Frontend

Below are the key details and conventions for integrating your frontend with this backend:

### Base API URL

- All endpoints are prefixed with `/api/v1/`
- Example: `http://localhost:8000/api/v1/`

### Authentication

- JWT-based authentication.
- Access and refresh tokens are managed via HTTP-only cookies.
- Protected routes require the user to be authenticated.

### File Uploads

- User registration and profile updates support avatar and cover image uploads (multipart/form-data).
- Video upload requires `video` and optionally `thumbnail` fields (multipart/form-data).

### Common Response Structure

All API responses follow this structure:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Descriptive message"
}
```
- On error, `success` is `false` and an appropriate `message` is provided.

### User Flows

- **Register/Login:** Obtain tokens via `/users/register` or `/users/login`.
- **Profile:** Fetch current user via `/users/current-user`.
- **Video Management:** Upload, update, delete, and fetch videos via `/videos` endpoints.
- **Playlists:** Create, update, delete, and manage playlists via `/playlist` endpoints.
- **Likes/Comments:** Like/unlike and comment on videos, tweets, and comments via `/likes` and `/comments` endpoints.
- **Subscriptions:** Subscribe/unsubscribe to channels and fetch subscriptions via `/subscriptions`.
- **Tweets:** Create, update, delete, and fetch tweets via `/tweets`.
- **Dashboard:** Fetch channel stats and videos via `/dashboard`.
- **Healthcheck:** Use `/healthcheck` to check server status.

### Error Handling

- All errors return a JSON response with `success: false` and a descriptive `message`.
- HTTP status codes are used appropriately (e.g., 400 for bad request, 401 for unauthorized, 404 for not found).

### CORS

- The backend is configured to accept requests from the origin specified in the `CORS_ORIGIN` environment variable.

### Example API Usage

- **Register User:**  
  `POST /api/v1/users/register`  
  Form data: `fullname`, `username`, `email`, `password`, `avatar`, `coverImage`

- **Upload Video:**  
  `POST /api/v1/videos`  
  Form data: `title`, `description`, `video`, `thumbnail`

- **Get All Videos:**  
  `GET /api/v1/videos?page=1&limit=10&query=searchText&sortBy=createdAt&sortType=desc`

- **Like a Video:**  
  `POST /api/v1/likes/toggle/v/:videoId`

- **Add Comment:**  
  `POST /api/v1/comments/:videoId`  
  Body: `{ "content": "Nice video!" }`

### Notes

- All protected routes require the user to be logged in.
- Use the provided endpoints and response structures to build your frontend features.
- Refer to the API Endpoints section above for all available routes.

---
