# AI-Agent Backend

This is the backend for the AI-Agent project. It is built using NestJS and TypeORM, and it integrates with OpenAI and Pinecone for various AI and database functionalities.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
- [Services](#services)
- [Entities](#entities)
- [Rate Limiting](#rate-limiting)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-repo/ai-agent-backend.git
cd ai-agent-backend

```

2. Install the dependencies:

```bash
npm install

```

3.  Configuration

Create a `.env` file in the root directory and add the following configurations:

```env
# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_URL=your_database_url

# OpenAI configuration
OPENAI_API_KEY=your_openai_api_key
LLM_MODEL=gpt-4o-mini

# Pinecone configuration
PINECONE_API_KEY=your_pinecone_api_key
INDEX_NAME=your_index_name
INDEX_HOST=your_index_host
EMBEDDING_MODEL=text-embedding-ada-002

# JWT configuration
JWT_SECRET_KEY=your_jwt_secret_key

```

4. Running the Application:

```bash
npm run start

```

The application will be available at http://localhost:3000.

Endpoints
Authentication
POST /auth/login-or-signup: Login or signup a user.
Review
POST /review/submit-reference: Submit a reference document.
POST /review/generate-review: Generate a personalized review.
POST /review/test-pinecone-connection: Test the connection to Pinecone.
POST /review/test-generate-embedding: Test the embedding generation.
Reference
GET /reference/get-reference: Get all references.
GET /reference/get-reference/:referenceId: Get a single reference by ID.
Review
GET /review/get-review: Get all reviews.
GET /review/get-review/:reviewId: Get a single review by ID.
Services
LlmService
This service integrates with OpenAI to generate feedback based on a given prompt.

VectorDbService
This service integrates with Pinecone to upsert and search embeddings.

ReviewService
This service handles the logic for generating reviews and processing references.

AuthService
This service handles the authentication logic, including login and signup.

Entities
User
Represents a user in the system.

Reference
Represents a reference document in the system.

Review
Represents a review in the system.

Rate Limiting
The application uses nestjs-rate-limiter to limit the number of requests to the LLM model and Pinecone DB. The rate limiting configuration is set using environment variables.

License
This project is licensed under the MIT License.
