import { app } from './app';

const start = async () => {
  app.listen(3000, () => {
    // TODO: PORT à remplacer avec variable d'environnement
    console.log('Listening on port 3000!!!!!!!!');
  });
};

start();
