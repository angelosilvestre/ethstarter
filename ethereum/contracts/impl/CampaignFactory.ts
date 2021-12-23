// generated with sol2ts
import Web3 from 'web3';
import { Contract, SendOptions, CallOptions } from 'web3-eth-contract';
import { TransactionConfig } from 'web3-core';

interface ContractInfo {
  bytecode?: any;
  address?: string;         
};

const abi = [{"inputs":[{"internalType":"uint256","name":"minimun","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deployedCampaigns","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDeployedCampaigns","outputs":[{"internalType":"address[]","name":"contracts","type":"address[]"}],"stateMutability":"view","type":"function"}];

export default class CampaignFactoryContract {
  private web3: Web3;
  private contract: Contract | undefined;
  private address: string | undefined;
  private bytecode: any | undefined;

  constructor(web3: Web3, contractInfo: ContractInfo) {
    this.web3 = web3;
    this.address = contractInfo.address;
    this.bytecode = contractInfo.bytecode;
  }

  private checkInitialized = () => {
    if (!this.contract) {
      if (!this.address) {
        throw new Error('Address is required');
      }  
      this.contract = new this.web3.eth.Contract(abi as any, this.address);
    }
  };

  balance = async (): Promise<BigInt> => {
    this.checkInitialized();
    let result = await this.web3.eth.getBalance(this.contract?.options.address!);
    return BigInt(result);
  };

  createCampaign = async (minimun: BigInt, options?: TransactionConfig): Promise<void> => {
    this.checkInitialized();
    return this.contract?.methods.createCampaign(minimun).send(options);
  };

  deployedCampaigns = async (arg0: BigInt, options?: CallOptions): Promise<string> => {
    this.checkInitialized();
    const result = await this.contract?.methods.deployedCampaigns(arg0).call(options);
    return result;
  };

  getAllDeployedCampaigns = async (options?: CallOptions): Promise<string[]> => {
    this.checkInitialized();
    const result = await this.contract?.methods.getAllDeployedCampaigns().call(options);
    return result;
  };

  deploy = async (options: SendOptions): Promise<Contract> => {
    this.contract = await new this.web3.eth.Contract(abi as any)
      .deploy({ data: this.bytecode })
      .send(options);
    return this.contract;
  };
}