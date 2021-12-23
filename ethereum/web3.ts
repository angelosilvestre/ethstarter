import Web3 from 'web3';

let web3: Web3;

if (
  typeof window !== 'undefined' &&
  typeof (window as any).ethereum !== 'undefined'
) {
  const eth = (window as any).ethereum;
  // metamask presetn
  eth.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(eth);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    process.env.NEXT_PUBLIC_PROVIDER_URL ?? ''
  );
  web3 = new Web3(provider);
}

export default web3;
