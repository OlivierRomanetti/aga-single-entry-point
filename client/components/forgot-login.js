import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Button } from 'react-bootstrap';

const ForgotLogin = () => {
  const { t } = useTranslation('common');
  return (
    <div className="actions">
      <Link href="/">
        <Button className="btn btn--form">{t('cancel')}</Button>
      </Link>
    </div>
  );
};

export default ForgotLogin;
