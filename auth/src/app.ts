import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { signinRouter } from './routes/signin';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cors, { CorsOptions } from 'cors'; // Importez CorsOptions pour spécifier les types

const app = express();

// Configuration de CORS avec des options de type CorsOptions
const corsOptions: CorsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(json());
app.use(express.json());

app.use(signinRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
