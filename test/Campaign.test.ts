import ganache from 'ganache-cli';
import _Web3 from 'web3';
import CampaignFactory from '../ethereum/contracts/impl/CampaignFactory';
import campaignFactoryByteCode from '../ethereum/contracts/impl/CampaignFactoryByteCode';
import Campaign from '../ethereum/contracts/impl/Campaign';
const web3 = new _Web3(ganache.provider());

let accounts: string[];
let factory: CampaignFactory;
let campaign: Campaign;
let managerAddress: string;
let donatorAddress: string;
let recipientAddress: string;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  managerAddress = accounts[0];
  donatorAddress = accounts[1];
  recipientAddress = accounts[2];
  factory = new CampaignFactory(web3, {
    bytecode: campaignFactoryByteCode,
  });
  await factory.deploy({
    from: managerAddress,
    gas: 5_000_000,
  });

  await factory.createCampaign(100n, {
    from: managerAddress,
    gas: 5_000_000,
  });

  let [address] = await factory.getAllDeployedCampaigns();
  campaign = new Campaign(web3, {
    address: address,
  });
});

describe('Campaigns', () => {
  test('deploys a factory and a campaign', () => {
    expect(campaign).toBeDefined();
  });
  test('marks caller as manager', async () => {
    let manager = await campaign.manager();
    expect(manager).toBe(managerAddress);
  });
  test('allow people to contribute and marks then as approvers', async () => {
    await campaign.contribute({
      from: donatorAddress,
      value: 200,
    });
    const isApprover = await campaign.approvers(donatorAddress);
    expect(isApprover).toBe(true);
  });
  test('requires a minimun contribution', async () => {
    try {
      await campaign.contribute({
        from: donatorAddress,
        value: 1,
      });
      fail('should have thrown');
    } catch (e) {}
  });
  test('allows the manager to make a payment request', async () => {
    await campaign.createRequest('My test request', 100n, recipientAddress, {
      from: managerAddress,
      gas: 1_000_000,
    });
    const request = await campaign.getRequest(0n, { from: managerAddress });
    expect(request.description).toBe('My test request');
  });
  test('process the request', async () => {
    let oldBalance = BigInt(await web3.eth.getBalance(recipientAddress));
    await campaign.contribute({ from: donatorAddress, value: 1_000_000 });
    await campaign.createRequest('A', 100_000n, recipientAddress, {
      from: managerAddress,
      gas: 1_000_000,
    });
    await campaign.approveRequest(0n, {
      from: donatorAddress,
      gas: 1_000_000,
    });
    await campaign.processRequest(0n, {
      from: managerAddress,
      gas: 1_000_000,
    });
    let newBalance = BigInt(await web3.eth.getBalance(recipientAddress));
    expect(newBalance).toBeGreaterThan(oldBalance);
  }, 10_000);
});
