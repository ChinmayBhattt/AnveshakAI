# AnveshakAI: A Decentralized Knowledge Powerhouse

This project is building a decentralized AI-powered knowledge assistant that runs entirely on the Internet Computer Protocol (ICP). It's designed to be a personalized AI that becomes an expert in any domain you provide, while ensuring data privacy and decentralization through blockchain technology.

## 🛠️ Our Team

This project was crafted with immense dedication and hard work by our talented team:

- **Aditya Dahuja** ([@Adhityadahuja](https://github.com/Adhityadahuja))  
- **Bhavya Jain** ([@bhavyajain009](https://github.com/bhavyajain009)) 

We poured our hearts into building this innovative solution, and we're excited to share it with the world!

## Visual Overview

```mermaid
flowchart TD
    A1["Frontend Interface (Next.js)"]
    A2["User Authentication & Identity (Internet Identity)"]
    A3["Canister Backend (Rust)"]
    A4["AI Engine (Google Gemini API)"]
    A5["Vector Search & Embedding System"]
    A6["Document Upload & Management"]
    A7["Streaming Response Module"]
    A8["DFX Deployment & Local Replica"]
    A9["Secure API Key Storage"]

    A1 -- "Authenticates via" --> A2
    A1 -- "Interacts with" --> A3
    A1 -- "Uploads documents to" --> A6
    A1 -- "Receives streaming output from" --> A7
    A1 -- "Visualizes data from" --> A5
    A3 -- "Handles logic for" --> A5
    A3 -- "Queries AI responses via" --> A4
    A3 -- "Stores & secures key in" --> A9
    A3 -- "Processes files from" --> A6
    A3 -- "Streams responses to" --> A7
    A8 -- "Builds & deploys" --> A1
    A8 -- "Deploys canisters" --> A3
```
    

## 🚀 Quick Start

### Prerequisites

Before setting up the Universal AI Assistant, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Rust** (latest stable) - [Install via rustup](https://rustup.rs/)
- **DFX** (Internet Computer SDK) - [Installation guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
- **Git** - [Download here](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChinmayBhattt/AnveshakAI-Decentralized-AI-Assistant.git
   cd AnveshakAI-Decentralized-AI-Assistant
   ```

2. **Install dependencies**
```
   # Install candid-extractor (required for deployment)
   cargo install candid-extractor
   ```

3. **Start the local Internet Computer replica**
   ```bash
   dfx start --background
   ```

4. **Deploy the canisters**
   ```bash
   dfx deploy
   ```

### 🔑 API Key Configuration

The Universal AI Assistant uses Google's Gemini API for AI responses. You'll need to configure an API key:

#### Step 1: Get a Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

#### Step 2: Set the API Key in Your Canister

After successful deployment, configure the API key using the DFX command line:

```bash
dfx canister call backend set_api_key '("YOUR_GEMINI_API_KEY_HERE")'
```

Replace `YOUR_GEMINI_API_KEY_HERE` with your actual Google Gemini API key.

**Important Security Notes:**
- Only canister controllers can set the API key
- The API key is stored securely in the canister's memory
- Never share your API key publicly or commit it to version control

#### Step 3: Test the Setup

Verify everything is working by testing the backend directly:

```bash
dfx canister call backend prompt '("Hello, how are you?")'
```

You should receive a response like:
```
(
  variant {
    Ok = "I am doing well, thank you for asking! How are you today?\n"
  },
)
```

### 🌐 Access Your Assistant

Once deployed, you can access your Universal AI Assistant through:

- **Local Development**: `http://localhost:4943/?canisterId=YOUR_FRONTEND_CANISTER_ID`
- **IC Network**: `https://YOUR_FRONTEND_CANISTER_ID.ic0.app`

The canister IDs will be displayed after successful deployment.

### 🛠️ Development Commands

```bash
# Start local replica
dfx start

# Deploy all canisters
dfx deploy

# Deploy only backend
dfx deploy backend

# Deploy only frontend
dfx deploy frontend

# Check canister status
dfx canister status backend
dfx canister status frontend

# View canister logs
dfx canister logs backend
```

### 🔧 Troubleshooting

#### Common Issues

1. **`candid-extractor: not found`**
   ```bash
   cargo install candid-extractor
   ```

2. **API key not set error**
   - Ensure you've set the API key using the `set_api_key` function
   - Verify you're calling from a controller account

3. **Frontend not receiving responses**
   - Check that the backend is deployed and running
   - Verify the API key is properly configured
   - Check browser console for any JavaScript errors

4. **DFX connection issues**
   ```bash
   dfx ping local
   # If this fails, restart the replica:
   dfx stop
   dfx start --background
   ```

## Core AI Capabilities

### Intelligent Document Processing
- **Multi-Format Support**: Ingests and processes various file types, including text, PDFs, code files, and images.
- **Automated Content Analysis**: Automatically extracts, chunks, and creates embeddings for all uploaded content.
- **Semantic Understanding**: Leverages BERT-like transformer models for a deep semantic understanding of the text.
- **OCR for Images**: Includes Optical Character Recognition (OCR) to extract text from image-based documents.

### Advanced Query System
- **Natural Language Interface**: A user-friendly, chat-like interface for asking questions in plain English.
- **Vector Similarity Search**: Retrieves the most relevant information using a high-performance vector similarity search.
- **Coherent Responses with Citations**: Generates clear, coherent answers and provides source citations for verification.
- **Confidence Scoring**: Each answer is accompanied by a confidence score to indicate the reliability of the information.

### Adaptive Learning
- **Instant Expertise**: Becomes an expert in any uploaded domain within seconds.
- **Cross-Document Analysis**: Cross-references information from multiple documents to provide comprehensive answers.
- **Contextual Conversations**: Maintains context throughout a conversation for a more natural and intelligent interaction.

## Technical Infrastructure

### Backend (Rust)
- **Efficient Vector Search**: Implements the HNSW (Hierarchical Navigable Small World) algorithm for efficient vector search across over 1 million vectors.
- **Contextual Understanding**: Utilizes attention mechanisms to better understand the context of queries.
- **Optimized Memory Management**: Designed to handle over 10,000 documents per user with optimized memory usage.
- **High-Speed Processing**: Achieves sub-100ms processing time per document chunk.

### Frontend (Next.js)
- **Real-Time File Uploads**: A drag-and-drop interface for file uploads with real-time processing status.
- **Document Management**: Features for previewing and categorizing uploaded documents.
- **Analytics Dashboard**: Provides usage metrics and other relevant analytics.
- **Streaming Responses**: Delivers responses as they are generated for a more interactive experience, with an option to export the conversation.

## Unique Value Propositions

### True Decentralization
- **ICP-Powered**: Runs entirely on the ICP blockchain with no reliance on external, centralized services.
- **User-Owned Data**: Ensures that users own their data, with built-in encryption for enhanced privacy.
- **Censorship-Resistant**: The decentralized architecture makes the assistant resistant to censorship.

### Performance & Cost
- **Affordable Model**: A pay-once-to-upload model with unlimited querying.
- **Fast Response Times**: Delivers sub-2-second response times, even for complex queries.
- **High Concurrency**: Supports over 100 concurrent users.

## Practical Use Cases

The Universal AI Assistant is designed to be versatile and can be applied to a wide range of scenarios:

- **Medical**: Upload medical textbooks and research papers to get diagnostic assistance.
- **Legal**: Upload legal documents and contracts to receive in-depth analysis and summaries.
- **Development**: Upload codebases to get explanations, identify potential issues, and receive suggestions for improvements.
- **Cross-Domain**: Handle a mix of document types for complex queries that span multiple fields of knowledge.
