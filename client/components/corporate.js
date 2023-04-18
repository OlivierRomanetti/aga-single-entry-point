import React from 'react';
import { useTranslation } from 'next-i18next';
const Corporate = () => {
  const { t } = useTranslation('common');
  return (
    <section className="section-corporate">
      <img src={t('logo')} className="logo" alt="AGA logo" />
    </section>
  );
};

export default Corporate;
