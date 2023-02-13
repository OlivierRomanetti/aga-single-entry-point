import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '../components/card';
import ForgotLogin from '../components/forgot-login';

const Help = () => (
  <Card title="help-title" subtitle="help-subtitle">
    <ForgotLogin />
  </Card>
);

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fr', ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export default Help;
