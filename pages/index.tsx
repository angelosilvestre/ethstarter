import React, { useEffect, useState } from 'react';
import CampaignFactory from '../ethereum/contracts/impl/CampaignFactory';
import web3 from '../ethereum/web3';
import { GetServerSideProps } from 'next';
import { Card, CardGroup, Button } from 'semantic-ui-react';
import Link from 'next/link';

const address = process.env.NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS;
const factory = new CampaignFactory(web3, { address });

interface HomePageProps {
  campaigns: string[];
}

const HomePage: React.FC<HomePageProps> = ({ campaigns }) => {
  const items = campaigns.map((e) => {
    return {
      header: e,
      description: <Link href={`/campaigns/${e}`}>View Campaign</Link>,
      fluid: true,
    };
  });

  return (
    <div>
      <h3>Open campaigns</h3>
      <Link href="/campaigns/new">
        <Button
          content="Create Campaign"
          icon="add circle"
          floated="right"
          primary
        />
      </Link>
      <CardGroup items={items} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  const res = await factory.getAllDeployedCampaigns();
  return {
    props: {
      campaigns: res,
    },
  };
};

export default HomePage;
