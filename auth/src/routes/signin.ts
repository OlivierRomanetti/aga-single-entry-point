import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { apiUrls } from '../utils/api-urls.utils';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('You must supply a username'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const concurrentRequests = apiUrls.map(({ url, apiKey }) =>
      axios.get(url, {
        headers: {
          apiKey: process.env[apiKey],
        },
        params: {
          username,
        },
      })
    );

    await Promise.all(concurrentRequests)
      .then((response) => {
        const possibleHits = response
          .map((item) => item.data)
          .filter((data) => data.exist);
        const isOneHit = possibleHits.length === 1;
        if (!isOneHit) {
          throw new Error('Not exactly one hit');
        }

        const oneHitIndex = response
          .map((item) => item.data)
          .findIndex((item) => item.exist);
        const { loginUrl } = possibleHits.find((item) => item.exist);

        const { domain, queryParamsFormat } = apiUrls[oneHitIndex];

        const apiLoginPath = queryParamsFormat
          ? JSON.stringify(
              `${domain}${loginUrl}${queryParamsFormat}${username}`
            )
          : JSON.stringify(`${domain}${loginUrl}`);

        res.status(200).send(apiLoginPath);
      })
      .catch((error) => {
        throw new BadRequestError('Something went wrong');
      });
  }
);

export { router as signinRouter };
