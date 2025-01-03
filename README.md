# TeachTech

TeachTech is an innovative platform designed to leverage AI for educational purposes. It incorporates tools such as AWS Textract for extracting text from documents and Google GeminiAI for advanced AI analysis. This README will guide you through setting up and running the project.

## Prerequisites

Before running the application, make sure you have the following:

- **Node.js** (version 14 or later)
- **npm** (Node Package Manager)
- **AWS Textract Key**
- **Google GeminiAI API Key**

## Getting Started

Follow these steps to get the project up and running on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/aayushpagare21-compcoder/TeachTech.git
cd teachtech
```

### 2. Install all the dependencies

```bash
npm install
```

### 3. Create your env file
```
cp sample.env .env
```

### 4. Configure API Keys
AWS Textract Key: You will need to sign up for AWS services and generate your AWS Textract API key.
Google GeminiAI Key: Similarly, sign up for Google GeminiAI and generate your GeminiAPI key.

### 5. Start the application
```bash
npm run dev
```