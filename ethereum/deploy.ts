import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';
import CampaignFactory from './contracts/impl/CampaignFactory';
import bytecode from './contracts/impl/CampaignFactoryByteCode';

const testMnemonic = ''; //set mnemonic here
const providerUrl = ''; // provider url here
const provider = new HDWalletProvider({
  mnemonic: {
    phrase: testMnemonic,
  },
  providerOrUrl: providerUrl,
});
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  const deploymentAccount = accounts[0];
  console.log(`Attempting to deploy using account ${deploymentAccount}`);
  const factory = new CampaignFactory(web3, { bytecode });
  const contract = await factory.deploy({
    from: deploymentAccount,
    gas: 5_000_000,
  });
  const address = contract.options.address;
  console.log(`Contract deployed to ${address}`);
  provider.engine.stop();
};
deploy();
