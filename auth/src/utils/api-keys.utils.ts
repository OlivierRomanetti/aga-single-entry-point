import * as fs from 'fs';

export async function readSecretFile(apiKey: string) {
  const filePath = `/run/secrets/${apiKey}`;

  try {
    process.env[apiKey] = await fs.promises.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du secret : ${error}`);
  }
}
