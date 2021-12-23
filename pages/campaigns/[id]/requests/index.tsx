import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Message, Table } from 'semantic-ui-react';
import RequestRow from '../../../../components/RequestRow';
import Campaign, {
  Campaign_RequestInfo,
} from '../../../../ethereum/contracts/impl/Campaign';
import web3 from '../../../../ethereum/web3';

interface CampaignRequestsProps {
  campaignAddress: string;
  requests: Campaign_RequestInfo[];
  approversCount: number;
}

const CampaignRequests: React.FC<CampaignRequestsProps> = ({
  campaignAddress,
  requests,
  approversCount,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const renderRow = (id: number, req: Campaign_RequestInfo) => {
    return (
      <RequestRow
        key={id}
        index={id}
        request={req}
        approversCount={approversCount}
        campaignAddress={campaignAddress}
        onError={async (e) => setErrorMessage(e)}
      />
    );
  };
  return (
    <div>
      <Link href={`/campaigns/${campaignAddress}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            New Request
          </Button>
        </a>
      </Link>
      {errorMessage && (
        <Message negative header="Oops!" content={errorMessage} />
      )}

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount (ether)</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {requests.map((e, index) => renderRow(index, e))}
        </Table.Body>
        <Table.Footer></Table.Footer>
      </Table>
      <div>Fount {requests.length} requests</div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CampaignRequestsProps> =
  async (context) => {
    let { id } = context.query;
    if (typeof id !== 'string') {
      id = id[0];
    }
    const campaign = new Campaign(web3, { address: id });
    const reqCount = await campaign.getRequestsCount();
    const requests: Campaign_RequestInfo[] = [];
    const approversCount = await campaign.aproversCount();
    for (let i = 0n; i < reqCount; i++) {
      const request = await campaign.getRequest(i);
      requests.push(request);
    }
    return {
      props: {
        campaignAddress: id,
        requests,
        approversCount: Number(approversCount),
      },
    };
  };

export default CampaignRequests;
