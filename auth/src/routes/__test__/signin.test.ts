import request from 'supertest';
import { app } from '../../app';
import nock from 'nock';
import { apiUrls } from '../../utils/api-urls.utils';

const username = 'username';

it('fails when the username is empty', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      username: '',
    })
    .expect(400);
});

it('fails if the username is not in any of the portals', async () => {
  apiUrls.forEach((api) => {
    nock(api.url)
      .matchHeader('apiKey', api.apiKey)
      .get('')
      .query({ username })
      .reply(200, { exist: false, loginUrl: '' });
  });
  await request(app)
    .post('/api/users/signin')
    .send({
      username,
    })
    .expect(400);
});

it('fails if the username is in all portals', async () => {
  apiUrls.forEach((api) => {
    nock(api.url)
      .matchHeader('apiKey', api.apiKey)
      .get('')
      .query({ username })
      .reply(200, { exist: true, loginUrl: '/login' });
  });
  await request(app)
    .post('/api/users/signin')
    .send({
      username,
    })
    .expect(400);
});

it('fails if the username is in two portals', async () => {
  const [api1, api2, ...otherApis] = apiUrls;
  nock(api1.url)
    .matchHeader('apiKey', api1.apiKey)
    .get('')
    .query({ username })
    .reply(200, { exist: true, loginUrl: '/login' });

  nock(api2.url)
    .matchHeader('apiKey', api2.apiKey)
    .get('')
    .query({ username })
    .reply(200, { exist: true, loginUrl: '/login' });

  otherApis.forEach((api, index) => {
    nock(api.url)
      .matchHeader('apiKey', api.apiKey)
      .get('')
      .query({ username })
      .reply(200, { exist: false, loginUrl: '' });
  });
  await request(app)
    .post('/api/users/signin')
    .send({
      username,
    })
    .expect(400);
});

it('fails if one apiKey is not correct', async () => {
  const [api1, ...otherApis] = apiUrls;
  nock(api1.url).get('').query({ username }).reply(401);

  otherApis.forEach((api) => {
    nock(api.url)
      .matchHeader('apiKey', api.apiKey)
      .get('')
      .query({ username })
      .reply(200, { exist: false, loginUrl: '' });
  });
  await request(app)
    .post('/api/users/signin')
    .send({
      username,
    })
    .expect(400);
});

it('succeed if the username is in one and only one portal', async () => {
  const [api1, ...otherApis] = apiUrls;
  nock(api1.url)
    .matchHeader('apiKey', api1.apiKey)
    .get('')
    .query({ username })
    .reply(200, { exist: true, loginUrl: '/login' });

  otherApis.forEach((api) => {
    nock(api.url)
      .matchHeader('apiKey', api.apiKey)
      .get('')
      .query({ username })
      .reply(200, { exist: false, loginUrl: '' });
  });
  await request(app)
    .post('/api/users/signin')
    .send({
      username,
    })
    .expect(200);
});
