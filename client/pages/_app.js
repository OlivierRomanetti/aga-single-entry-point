import { appWithTranslation } from 'next-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/general.css';
import '../styles/style.css';
import '../styles/queries.css';
import Locale from '../components/locale';
import Corporate from '../components/corporate';

const AppComponent = ({ Component, pageProps }) => {
  return (
    <>
      <Locale />
      <main className="layout layout--2-cols layout--center-v">
        <Corporate />
        <Component {...pageProps} />;
      </main>
    </>
  );
};

export default appWithTranslation(AppComponent);
