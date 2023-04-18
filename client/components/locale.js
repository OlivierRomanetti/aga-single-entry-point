import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { useTranslation } from 'next-i18next';

const Locale = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const changeTo = router.locale === 'fr' ? 'en' : 'fr';

  return (
    <Link href={router.pathname} locale={changeTo}>
      <div className="locale">
        <div className="locale-center">{t('change-locale')}</div>
      </div>
    </Link>
  );
};

export default Locale;
