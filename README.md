# AI Platform – Knowledge Base & Customer Service Copilot

## Overview
This project implements a mini knowledge-base assistant that:
- Ingests internal documents into vector embeddings.
- Retrieves the most relevant chunks for a user query.
- Generates a grounded response that includes cited sources.
- Provides a UI for uploading documents and chatting.

## Architecture (High Level)
- **Client (Vite + React):**
  - `Dashboard` renders `DocumentPanel` (seed/upload) + `Chat`.
  - `Chat` posts questions to `/api/chat` and renders AI responses.
  - Responses include `sources`, shown beneath each AI message.
- **Server (Express + MongoDB + Gemini embeddings):**
  - `/api/documents/upload` stores chunks + embeddings for uploaded files.
  - `/api/documents/seed` indexes mock documents from `server/src/data/mock_docs`.
  - `/api/chat` retrieves top chunks via cosine similarity, then uses Gemini to answer.
  - `DocumentChunk` is stored in MongoDB with `text`, `embedding`, and `source`.

## Key Decisions
- **Grounded answers only:** The prompt instructs the model to answer using provided context and return "I don't know" when no context matches.
- **Source citations:** Each AI response includes `sources` derived from the retrieved chunks.
- **Deterministic retrieval:** Cosine similarity over stored embeddings (top `k=3`).
- **Mock documents for quick grading:** Seed endpoint makes grading easy without manual uploads.

## Endpoints
- `POST /api/documents/seed`  
  Indexes mock docs from `server/src/data/mock_docs`.
- `POST /api/documents/upload`  
  Uploads a `.txt` file and indexes it.
- `GET /api/documents/sources`  
  Returns the list of indexed sources.
- `POST /api/chat`  
  Body: `{ "question": "..." }`  
  Returns: `{ answer, sources }`

## Setup
1. Start MongoDB locally.
2. Ensure `server/.env` has:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
3. Start backend from `server` and frontend from `client`.

## Usage
1. Login/register.
2. Click **Seed Mock Docs** in the dashboard.
3. Ask questions in the chat (e.g., "What is the return window?").
4. Verify that responses include source citations.

## Notes / Limitations
- Only `.txt` files are supported for uploads.
- If no relevant chunks exist, the system responds with "I don't know".
- Embedding and generation rely on Gemini API availability and a valid API key.
