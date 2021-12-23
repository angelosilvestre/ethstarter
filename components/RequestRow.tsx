import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign, {
  Campaign_RequestInfo,
} from '../ethereum/contracts/impl/Campaign';
import web3 from '../ethereum/web3';

interface RequestRowProps {
  index: number;
  request: Campaign_RequestInfo;
  approversCount: number;
  campaignAddress: string;
  onError: (message: string) => {};
}

const RequestRow: React.FC<RequestRowProps> = ({
  index,
  request,
  approversCount,
  campaignAddress,
  onError,
}) => {
  const router = useRouter();
  const [approving, setApproving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const readyToFinalize =
    !request.complete && request.approvalCount > BigInt(approversCount) / 2n;
  const fullyApproved = request.approvalCount == BigInt(approversCount);

  const onApprove = async () => {
    setApproving(true);
    onError('');
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = new Campaign(web3, { address: campaignAddress });
      await campaign.approveRequest(BigInt(index), {
        from: accounts[0],
      });
      router.reload();
    } catch (e: any) {
      onError(e.message);
    }
    setApproving(false);
  };

  const onFinalize = async () => {
    setFinalizing(true);
    onError('');
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = new Campaign(web3, { address: campaignAddress });
      await campaign.processRequest(BigInt(index), {
        from: accounts[0],
      });
      router.reload();
    } catch (e: any) {
      onError(e.message);
    }
    setFinalizing(false);
  };

  return (
    <Table.Row disabled={request.complete} positive={readyToFinalize}>
      <Table.Cell>{index}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell textAlign="right">
        {web3.utils.fromWei(request.value.toString(), 'ether')}
      </Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>
        {request.approvalCount}/{approversCount}
      </Table.Cell>
      <Table.Cell textAlign="center">
        {!(request.complete || fullyApproved) && (
          <Button
            color="green"
            onClick={onApprove}
            loading={approving}
            basic
            disabled={approving || finalizing}
          >
            Approve
          </Button>
        )}
      </Table.Cell>
      <Table.Cell>
        {!request.complete && (
          <Button
            color="teal"
            onClick={onFinalize}
            loading={finalizing}
            basic
            disabled={approving || finalizing}
          >
            Finalize
          </Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default RequestRow;
