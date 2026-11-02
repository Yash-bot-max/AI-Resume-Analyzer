const { CohereClientV2 } = require("cohere-ai");

// Initialize Cohere client using the API key from environment variables
const cohere = new CohereClientV2({
    token: process.env.COHERE_API_KEY
});

module.exports = cohere;