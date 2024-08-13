import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/route';
import { AppDataSource } from './configs/ormconfig';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { securityMiddleware } from './middlewares/securityHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// For debugging purposes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(securityMiddleware);

AppDataSource.initialize()
  .then(() => {
    console.log('DataSource initialized');
    const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));
    app.use('/api-docs/swagger.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocument);
    });
    // Middleware setup
    app.use(cors());
    app.use(bodyParser.json());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api/v1/', router);
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Error initializing DataSource', error));
