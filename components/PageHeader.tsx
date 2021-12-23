import Link from 'next/link';
import React, { useState } from 'react';
import { Item as a, Menu, MenuItemProps, Segment } from 'semantic-ui-react';

const PageHeader = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href={'/'}>
        <a className="item">Ethstarter</a>
      </Link>
      <Menu.Menu position="right">
        <Link href={'/'}>
          <a className="item">Campaigns</a>
        </Link>
        <Link href={'/campaigns/new'}>
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default PageHeader;
