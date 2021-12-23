import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, FormProps, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/contracts/impl/Campaign';
import web3 from '../ethereum/web3';

interface ContributeProps {
  campaignAddress: string;
}

const Contribute: React.FC<ContributeProps> = ({ campaignAddress }) => {
  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const campaign = new Campaign(web3, { address: campaignAddress });
      const accounts = await web3.eth.getAccounts();
      await campaign.contribute({
        from: accounts[0],
        value: web3.utils.toWei(contribution, 'ether'),
      });
      router.reload();
    } catch (e: any) {
      setErrorMessage(e.message);
    }
    setLoading(false);
    setContribution('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={contribution}
          onChange={(e) => setContribution(e.target.value)}
        />
      </Form.Field>
      {errorMessage && (
        <Message negative header="Oops!" content={errorMessage} />
      )}
      <Button primary loading={loading}>
        Contribute
      </Button>
    </Form>
  );
};

export default Contribute;
