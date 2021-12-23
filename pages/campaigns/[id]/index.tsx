import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { Button, Card, CardProps, Grid } from 'semantic-ui-react';
import Contribute from '../../../components/Contribute';
import Campaign, {
  GetSummaryResult,
} from '../../../ethereum/contracts/impl/Campaign';
import web3 from '../../../ethereum/web3';
import styles from '../../../styles/Campaign.module.css';

interface CampaignViewProps {
  campaignAddress: string;
  summary: GetSummaryResult;
}

const CampaignView: React.FC<CampaignViewProps> = ({
  campaignAddress,
  summary,
}) => {
  const renderItems = () => {
    const items: CardProps[] = [
      {
        header: summary.campaignManager,
        meta: 'Address of Manager',
        description:
          'The manager created this campaign and can create requests to withdraw money.',
        className: styles.campaignCard,
      },
      {
        header: summary.campaignMinimunContribution,
        meta: 'Minimun Contribution (wei)',
        description:
          'You must contribute at least this much way to become an approver',
        className: styles.campaignCard,
      },
      {
        header: summary.campaignNumRequests,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by approvers',
        className: styles.campaignCard,
      },
      {
        header: summary.campaignAproversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who already donated to the campaign',
        className: styles.campaignCard,
      },
      {
        header: web3.utils.fromWei(
          web3.utils.toBN(summary.campaignBalance as any),
          'ether'
        ),
        meta: 'Campaign Balance (ether)',
        description:
          'The balance is how much money this campaign has left to spend',
        className: styles.campaignCard,
      },
    ];
    return <Card.Group items={items} />;
  };

  return (
    <div>
      <h3>Campaign View</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderItems()}</Grid.Column>
          <Grid.Column width={6}>
            <Contribute campaignAddress={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`${campaignAddress}/requests`}>
              <a>
                <Button>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CampaignViewProps> = async (
  context
) => {
  let { id } = context.query;
  if (typeof id !== 'string') {
    id = id[0];
  }
  const campaign = new Campaign(web3, { address: id });
  const res = await campaign.getSummary();
  return {
    props: {
      summary: res,
      campaignAddress: id,
    },
  };
};

export default CampaignView;
