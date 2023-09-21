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

    await Promise.allSettled(concurrentRequests)
      .then((results) => {
        const foundApiIndex = results.findIndex(
          (result) => result.status === 'fulfilled' && result.value.data.exist
        );

        if (foundApiIndex === -1) {
          throw new Error('User not found');
        }
        const { loginUrl } = (
          results[foundApiIndex] as PromiseFulfilledResult<any>
        ).value.data;

        const { domain, queryParamsFormat } = apiUrls[foundApiIndex];

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
