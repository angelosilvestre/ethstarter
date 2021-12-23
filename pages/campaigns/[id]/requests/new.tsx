import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../../../../ethereum/contracts/impl/Campaign';
import web3 from '../../../../ethereum/web3';

interface CampaignRequestNewProps {
  address: string;
}

const RequestNew: React.FC<CampaignRequestNewProps> = ({ address }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      const campaign = new Campaign(web3, { address });
      await campaign.createRequest(
        description,
        BigInt(web3.utils.toWei(amount, 'ether')),
        recipient,
        {
          from: accounts[0],
        }
      );
      router.push(`/campaigns/${address}/requests`);
    } catch (e: any) {
      setErrorMessage(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Create a request</h1>
      <Form onSubmit={handleSubmit}>
        {errorMessage && (
          <Message negative header="Oops!" content={errorMessage} />
        )}
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in ether</label>
          <Input
            label={{ basic: true, content: 'ether' }}
            labelPosition="right"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" primary loading={loading}>
          Create
        </Button>
      </Form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<CampaignRequestNewProps> =
  async (context) => {
    let { id } = context.query;
    if (typeof id !== 'string') {
      id = id[0];
    }
    return {
      props: {
        address: id,
      },
    };
  };

export default RequestNew;
