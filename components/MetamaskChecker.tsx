import React, { useEffect, useReducer } from 'react';
import { Message } from 'semantic-ui-react';

const MetamaskChecker = () => {
  const runingInTheBrowser = typeof window !== 'undefined';
  const [_, refresh] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (runingInTheBrowser) {
      refresh();
    }
  }, [runingInTheBrowser]);
  const hasMetaMask =
    runingInTheBrowser && typeof (window as any).ethereum !== 'undefined';
  return (
    !hasMetaMask && (
      <Message
        negative
        content={
          'MetaMask extension not found in the browser!!! To be able to send transactions to the blockchain you need MetaMask installed.'
        }
      />
    )
  );
};

export default MetamaskChecker;
