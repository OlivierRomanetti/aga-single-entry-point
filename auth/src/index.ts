import { app } from './app';
import { readSecretFile } from './utils/api-keys.utils';
import { apiUrls } from './utils/api-urls.utils';

const start = async () => {
  // On lit les secrets et on les positionne dans des variables d'environnement.
  // Maintenant, toutes les clés API sont lues et stockées en tant que variables d'environnement
  await Promise.all(apiUrls.map((api) => readSecretFile(api.apiKey)));
  app.listen(8080, () => {});
};

start();
