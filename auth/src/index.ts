import { app } from './app';

const port = process.env.PORT || 8080; // Utilisation du port 8080 par défaut si PORT n'est pas défini

const start = async () => {
  app.listen(8080, () => {});
};

start();
