import React, { useState } from 'react';
import { Button, Form, FormProps, Input, Message } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import CampaignFactory from '../../ethereum/contracts/impl/CampaignFactory';
import web3 from '../../ethereum/web3';

const address = process.env.NEXT_PUBLIC_CONTRACT_FACTORY_ADDRESS;
const factory = new CampaignFactory(web3, { address });

const CampaignNew = () => {
  const [minimunContribution, setMinimunContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.createCampaign(BigInt(minimunContribution), {
        from: accounts[0],
      });
      router.push('/');
    } catch (e: any) {
      setErrorMessage(e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleSubmit}>
        {errorMessage && (
          <Message negative header="Oops!" content={errorMessage} />
        )}
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label={{ basic: true, content: 'wei' }}
            labelPosition="right"
            placeholder="Minimum contribution for someone to participate"
            value={minimunContribution}
            onChange={(e) => setMinimunContribution(e.target.value)}
          />
        </Form.Field>
        <Button type="submit" primary loading={loading}>
          Create
        </Button>
      </Form>
    </div>
  );
};

export default CampaignNew;
