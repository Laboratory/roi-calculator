import React from 'react';
import { Spinner } from 'react-bootstrap';

const PageLoader = () => {
  return (
    <div className="page-loader d-flex justify-content-center align-items-center py-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <span className="ms-3">Loading content...</span>
    </div>
  );
};

export default PageLoader;
