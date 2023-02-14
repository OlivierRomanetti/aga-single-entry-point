import React from 'react';
import { useTranslation } from 'next-i18next';

const Card = ({ title, subtitle, children }) => {
  const { t } = useTranslation('common');
  return (
    <section className="section-cta" id="cta">
      <div className="container">
        <div className="cta">
          <div className="cta-text-box">
            <h2 className="heading-primary">{t(title)}</h2>
            <p className="cta-text">{t(subtitle)}</p>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
