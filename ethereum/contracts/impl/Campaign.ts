// generated with sol2ts
import Web3 from 'web3';
import { Contract, SendOptions, CallOptions } from 'web3-eth-contract';
import { TransactionConfig } from 'web3-core';

interface ContractInfo {
  bytecode?: any;
  address?: string;         
};

export interface Campaign_RequestInfo {
  description: string;
  value: BigInt;
  recipient: string;
  complete: boolean;
  approvalCount: BigInt;         
};

export interface GetSummaryResult {
  campaignMinimunContribution: BigInt;
  campaignBalance: BigInt;
  campaignNumRequests: BigInt;
  campaignAproversCount: BigInt;
  campaignManager: string;         
};

const abi = [{"inputs":[{"internalType":"uint256","name":"minimun","type":"uint256"},{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"requestIndex","type":"uint256"}],"name":"approveRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"approvers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"aproversCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"contribute","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"address payable","name":"recipient","type":"address"}],"name":"createRequest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestIndex","type":"uint256"}],"name":"getRequest","outputs":[{"components":[{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"bool","name":"complete","type":"bool"},{"internalType":"uint256","name":"approvalCount","type":"uint256"}],"internalType":"struct Campaign.RequestInfo","name":"request","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRequestsCount","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSummary","outputs":[{"internalType":"uint256","name":"campaignMinimunContribution","type":"uint256"},{"internalType":"uint256","name":"campaignBalance","type":"uint256"},{"internalType":"uint256","name":"campaignNumRequests","type":"uint256"},{"internalType":"uint256","name":"campaignAproversCount","type":"uint256"},{"internalType":"address","name":"campaignManager","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"manager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimunContribution","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestIndex","type":"uint256"}],"name":"processRequest","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export default class CampaignContract {
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

  deploy = async (minimun: BigInt, creator: string, options: SendOptions): Promise<Contract> => {
    this.contract = await new this.web3.eth.Contract(abi as any)
      .deploy({ data: this.bytecode, arguments: [minimun, creator]})
      .send(options);
    return this.contract;
  };

  approveRequest = async (requestIndex: BigInt, options?: TransactionConfig): Promise<void> => {
    this.checkInitialized();
    return this.contract?.methods.approveRequest(requestIndex).send(options);
  };

  approvers = async (arg0: string, options?: CallOptions): Promise<boolean> => {
    this.checkInitialized();
    const result = await this.contract?.methods.approvers(arg0).call(options);
    return result;
  };

  aproversCount = async (options?: CallOptions): Promise<BigInt> => {
    this.checkInitialized();
    const result = await this.contract?.methods.aproversCount().call(options);
    return BigInt(result);
  };

  contribute = async (options?: TransactionConfig): Promise<void> => {
    this.checkInitialized();
    return this.contract?.methods.contribute().send(options);
  };

  createRequest = async (description: string, value: BigInt, recipient: string, options?: TransactionConfig): Promise<void> => {
    this.checkInitialized();
    return this.contract?.methods.createRequest(description, value, recipient).send(options);
  };

  getRequest = async (requestIndex: BigInt, options?: CallOptions): Promise<Campaign_RequestInfo> => {
    this.checkInitialized();
    const resultArr : any[] = await this.contract?.methods.getRequest(requestIndex).call(options);
    let result = {
      description : resultArr[0],
      value : resultArr[1],
      recipient : resultArr[2],
      complete : resultArr[3],
      approvalCount : resultArr[4],
    }       
    return result;
  };

  getRequestsCount = async (options?: CallOptions): Promise<BigInt> => {
    this.checkInitialized();
    const result = await this.contract?.methods.getRequestsCount().call(options);
    return BigInt(result);
  };

  getSummary = async (options?: CallOptions): Promise<GetSummaryResult> => {
    this.checkInitialized();
    const resultArr : any[] = await this.contract?.methods.getSummary().call(options);
    let result = {
      campaignMinimunContribution : resultArr[0],
      campaignBalance : resultArr[1],
      campaignNumRequests : resultArr[2],
      campaignAproversCount : resultArr[3],
      campaignManager : resultArr[4],
    }       
    return result;
  };

  manager = async (options?: CallOptions): Promise<string> => {
    this.checkInitialized();
    const result = await this.contract?.methods.manager().call(options);
    return result;
  };

  minimunContribution = async (options?: CallOptions): Promise<BigInt> => {
    this.checkInitialized();
    const result = await this.contract?.methods.minimunContribution().call(options);
    return BigInt(result);
  };

  processRequest = async (requestIndex: BigInt, options?: TransactionConfig): Promise<void> => {
    this.checkInitialized();
    return this.contract?.methods.processRequest(requestIndex).send(options);
  };


}