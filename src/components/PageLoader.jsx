import React from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PageLoader = () => {
  const { t } = useTranslation('pageloader');
  
  return (
    <div className="page-loader d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
      <span className="ms-3">{t('loadingContent')}</span>
    </div>
  );
};

export default PageLoader;
