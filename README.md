 📌 Social Media Content Scheduler — Backend

This repository contains the backend source code for the Social Media Content Scheduler, a full-stack application that allows users to create, schedule, and manage social media posts.
The backend is built with Node.js, Express, and Supabase PostgreSQL, and provides secure authentication and REST APIs for all features in the application.

🔗 Repository
     Github:https://github.com/kuppinedibhavani-dev/social_media_Backend1

1. Project Overview
     The backend handles all application logic, including:
         =>🔐 User Authentication (Signup/Login) using Supabase Auth
         =>📝 CRUD operations for social media posts
         =>🖼️ Image upload handling (Supabase Storage / Cloud)
         =>⚙️ Middleware-based validation and error handling
         =>🗄️ PostgreSQL database communication via Supabase client
         **🚀 Production-ready API deployed on Render
             This backend is fully integrated with the Frontend and exposes secure REST APIs for post scheduling, data management, and user sessions.

2. Tech Stack
     a.Backend Framework =>	Node.js, Express.js
     b.Database =>	Supabase PostgreSQL
     c.Authentication =>	Supabase JWT
     d.File Storage	=> Supabase Storage
     e.Other Libraries	=> bcrypt, dotenv, multer, cors, axios
     d.Deployment =>	Render


3. API Documentation
    a.Authentication APIs:
    Method	 Endpoint	     Description
    POST	/auth/signup	Registers a new user
    POST	/auth/login	  Authenticates user and returns JWT token

   b.Posts APIs
    Method	 Endpoint	     Description
     POST	 /posts	     Create a new scheduled post
     GET	/posts	     Fetch all posts for a user
     GET	/posts/:id	  Fetch a single post
     PUT	/posts/:id	  Update a scheduled post
    DELETE	/posts/:id	   Delete a post

Request Example – Create Post:
   {
  "content": "My first scheduled post",
  "scheduled_date": "2024-05-15T10:00:00",
  "image_url": "optional-image-link"
 }
 Response Example:
    {
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 12,
    "content": "My first scheduled post",
    "scheduled_date": "2024-05-15T10:00:00",
    "user_id": "uid123"
  }
}


🟦 4. Database Schema Explanation
       The application uses Supabase PostgreSQL with the following core tables:
       🧑‍💼 users Table
        Column	      Type	               Description
         id	UUID	Primary key        (Supabase Auth user ID)
        email	    varchar	             User email
      password_hash	 varchar	        Encrypted password
       created_at	 timestamp	         Auto timestamp

       📝 posts Table
       Column	     Type	         Description
         id	        bigint	     Primary key
       user_id	     UUID	      Foreign key → users.id
       content	     text	       Post/content text
    scheduled_date	 timestamp	  When the post will be published
      image_url	      text	        Optional image
      created_at	timestamp	   Post creation time
       updated_at	timestamp	  Modification time

     📦 storage Buckets:
         =>Used for storing uploaded images.

      A.Database Relationships

        =>One-to-Many:
              A user → can have multiple posts

       B.Posts store user_id which maps directly to Supabase Auth ID

🟦 5. Installation Steps
       ✅ 1. Clone Repo
                git clone https://github.com/kuppinedibhavani-dev/social_media_Backend1
                 cd social_media_Backend1
        ✅ 2. Install Dependencies
                 npm install
        ✅ 3. Create .env File
                 SUPABASE_URL=https://eqvgehnortvpsnlqfrnf.supabase.co
                 SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxdmdlaG5vcnR2cHNubHFmcm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTk4MjcsImV4cCI6MjA4Njk3NTgyN30.Xm1bmvRe55IFyBA4p6JgwByBuF0btOlT9uxjSFS-kHM
                 JWT_SECRET=supersecret123
                 PORT=5000

        ✅ 4. Run Development Server
            npm run dev

        ✅ 5. Run Production Server
            npm start


🟦 6. Deployment Link


🔗 API Base URL:https://social-media-backend1-1.onrender.com/api

