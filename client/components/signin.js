import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import useRequest from '../hooks/use-request';

const Signin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [validated, setValidated] = useState(false);

  const { t } = useTranslation('common');

  const { doRequest } = useRequest({
    url: 'api/users/signin',
    method: 'post',
    body: {
      username,
    },
    onSuccess: (response) => {
      window.location.href = response;
    },
    onError: (error) => {
      router.push('/help');
    },
  });

  const handleSubmit = async (event) => {
    const form = event.currentTarget;

    event.preventDefault();
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setLoading(true);
      await doRequest();
    }
  };
  return (
    <Form
      className="cta-form"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Group controlId="validationCustom">
        <Form.Label>{t('identifier')}</Form.Label>
        <Form.Control
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t('placeholder')}
          required
        />
        <Form.Control.Feedback type="invalid">
          {t('required')}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="actions">
        {loading ? (
          <Spinner animation="border" role="status"/>
        ) : (
          <>
            <Button className="btn btn--form" type="submit">
              {t('validate')}
            </Button>
            <Link href="/help">
              <div className="link"> {t('help-title')}</div>
            </Link>
          </>
        )}
      </div>
    </Form>
  );
};

export default Signin;
