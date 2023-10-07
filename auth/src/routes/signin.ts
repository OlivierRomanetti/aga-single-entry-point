import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { apiUrls } from '../utils/api-urls.utils';
import axios, { AxiosResponse } from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

// ---------------------------------------------------
const MAX_API_TIMEOUT = 1000;
// ---------------------------------------------------

type ApiInfos = {
  name: string;
  domain: string;
  url: string;
  apiKey: string;
  queryParamsFormat: string;
};

type LoginPathParams = {
  domain: string;
  loginUrl: string;
  queryParamsFormat: string;
  username: string;
};

type ApiResponse = AxiosResponse<any>;

// ---------------------------------------------------

const setConcurrentRequests = (username: string): Promise<ApiResponse>[] =>
  apiUrls.map(({ url, apiKey }: ApiInfos) =>
    axios.get(url, {
      headers: {
        apiKey: process.env[apiKey],
      },
      params: {
        username,
      },
      timeout: MAX_API_TIMEOUT,
    })
  );

// ---------------------------------------------------

type ApiUrl = {
  url: string;
  apiKey: string;
  // ... Autres propriétés
};

const getApiInfos = (results: PromiseSettledResult<ApiResponse>[]) => {
  const apiIndex = results.findIndex((result) => {
    return result.status === 'fulfilled' && result.value.data.exist;
  });
  if (apiIndex === -1) {
    throw new Error('User not found');
  }
  const { loginUrl } = (
    results[apiIndex] as PromiseFulfilledResult<AxiosResponse>
  ).value.data;

  const { domain, queryParamsFormat } = apiUrls[apiIndex];
  return { loginUrl, domain, queryParamsFormat };
};

// ---------------------------------------------------

const setApiLoginPath = (params: LoginPathParams): string => {
  const { domain, loginUrl, queryParamsFormat, username } = params;
  return queryParamsFormat
    ? JSON.stringify(`${domain}${loginUrl}${queryParamsFormat}${username}`)
    : JSON.stringify(`${domain}${loginUrl}`);
};

const router = express.Router();

// ---------------------------------------------------
// End Point
// ---------------------------------------------------

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

    await Promise.allSettled(setConcurrentRequests(username))
      .then((results) => {
        res.status(200).send(
          setApiLoginPath({
            ...getApiInfos(results),
            username,
          })
        );
      })
      .catch((error) => {
        throw new BadRequestError('Something went wrong');
      });
  }
);

export { router as signinRouter };
