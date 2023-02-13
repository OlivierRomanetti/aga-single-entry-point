import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { apiUrls } from '../utils/api-urls.utils';
import axios from 'axios';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

async function queryAllPortals(username: string): Promise<string | null> {
  // /* Analyze values from portals */
  // // More than one portal found using username
  // if (result.filter((item) => item == true).length > 1) {
  //   // More than one portal found using username
  //   // TODO: Maybe do something more specific in this case, like providing a choice between the results

  //   return null;
  // } else if (result.filter((item) => item == true).length === 0) {
  //   // No portal found

  //   return null;
  // } else if (result.filter((item) => item == true).length === 1) {
  //   // 1 Portal found

  //   return portalsList[result.findIndex((item) => item === true)].redirectUrl;
  // }
  return 'h';
}

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
          apiKey,
        },
        params: {
          username,
        },
      })
    );

    await Promise.all(concurrentRequests)
      .then((response) => {
        const { exist, loginUrl } = response[0].data;

        if (exist) {
          res
            .status(200)
            .send(
              JSON.stringify(`${apiUrls[0].domain}${loginUrl.toLowerCase()}`)
            );
        }
      })
      .catch((error) => {
        throw new BadRequestError('Something went wrong');
      });
  }
);

export { router as signinRouter };
