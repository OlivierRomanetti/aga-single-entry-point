import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Card from '../components/card';
import Signin from '../components/signin';

const Main = () => (
  <Card title="main-title" subtitle="main-subtitle">
    <Signin />
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

export default Main;
