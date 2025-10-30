import serverless from 'serverless-http';
import app from './app.js';

// Exporta handler compatível com AWS Lambda + API Gateway
export const handler = serverless(app);


