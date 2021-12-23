import React from 'react';
import { Container } from 'semantic-ui-react';
import MetamaskChecker from './MetamaskChecker';
import PageHeader from './PageHeader';

const Layout = ({ children }) => {
  return (
    <Container>
      <PageHeader />
      {/* <MetamaskChecker /> */}
      {children}
    </Container>
  );
};

export default Layout;
