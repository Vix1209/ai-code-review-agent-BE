# AI-Agent Backend

This is the backend for the AI-Agent project. It is built using NestJS and TypeORM, and it integrates with OpenAI and Pinecone for various AI and database functionalities.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
- [Services](#services)
- [Entities](#entities)

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

# Environment Setup
NODE_ENV=development
PORT=4000

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
TOP_K_VALUE=3
EMBEDDING_MODEL=text-embedding-ada-002

# JWT configuration
JWT_SECRET_KEY=your_jwt_secret_key

# Swagger Docs Setup
API_VERSION='1'
APP_NAME='Ai-Agent'

```

4. Running the Application:

```bash
npm run start

```

The application will be available at http://localhost:4000.

## Endpoints

<details> <summary>Authentication</summary> <ul> <li><code>POST /auth/login-or-signup</code>: Login or signup a user.</li> </ul> </details> <details> <summary>Review (POST)</summary> <ul> <li><code>POST /review/submit-reference</code>: Submit a reference document.</li> <li><code>POST /review/generate-review</code>: Generate a personalized review.</li> <li><code>POST /review/submit-feedback</code>: Submit feedback on a review to improve future responses.</li> </ul> </details> <details> <summary>Reference</summary> <ul> <li><code>GET /reference/get-reference</code>: Get all references.</li> <li><code>GET /reference/get-reference/:referenceId</code>: Get a single reference by ID.</li> </ul> </details> <details> <summary>Review (GET)</summary> <ul> <li><code>GET /review/get-review</code>: Get all reviews.</li> <li><code>GET /review/get-review/:reviewId</code>: Get a single review by ID.</li> </ul> </details>

## Services

<details> <summary>LlmService</summary> <p>This service integrates with OpenAI to generate feedback based on a given prompt.</p> </details> <details> <summary>VectorDbService</summary> <p>This service integrates with Pinecone to upsert and search embeddings.</p> </details> <details> <summary>ReviewService</summary> <p>This service handles the logic for generating reviews and processing references.</p> </details> <details> <summary>AuthService</summary> <p>This service handles the authentication logic, including login and signup.</p> </details> <details> <summary>DatabaseService</summary> <p>This service handles the database operations for saving and retrieving references and reviews.</p> <ul> <li><code>saveReference</code>: Save a reference (e.g., snippet and embedding) to the database.</li> <li><code>saveReview</code>: Save a review to the database.</li> <li><code>updateReviewWithFeedback</code>: Update a review with user feedback.</li> <li><code>getAllReferences</code>: Fetch all references for debugging or audit purposes.</li> <li><code>getSingleReference</code>: Fetch a single reference by ID.</li> <li><code>getAllReviews</code>: Fetch all reviews for debugging or audit purposes.</li> <li><code>getSingleReview</code>: Fetch a single review by ID.</li> </ul> </details>

## Entities

<details> <summary>User</summary> <p>Represents a user in the system.</p> </details> <details> <summary>Reference</summary> <p>Represents a reference document in the system.</p> </details> <details> <summary>Review</summary> <p>Represents a review in the system.</p> </details>

<!-- ## Rate Limiting

<p>The application uses <code>nestjs-rate-limiter</code> to limit the number of requests to the LLM model and Pinecone DB. The rate limiting configuration is set using environment variables.</p> -->

## License

<p>This project is licensed under the MIT License.</p>
