import { CosmWasmCodec } from "@cosmwasm/bcp";
import {
  Account,
  AccountQuery,
  AddressQuery,
  BlockchainConnection,
  BlockHeader,
  BlockId,
  ChainConnector,
  ChainId,
  ConfirmedAndSignedTransaction,
  ConfirmedTransaction,
  FailedTransaction,
  Fee,
  Nonce,
  PostableBytes,
  PostTxResponse,
  PubkeyQuery,
  Token,
  TokenTicker,
  TransactionId,
  TransactionQuery,
  UnsignedTransaction,
} from "@iov/bcp";
import { Stream } from "xstream";

import { ChainSpec } from "./configurationfile";

// The following HARD-CODED values are shared between Neuma and the apps
const addressPefix = "star";
const bankToken = {
  fractionalDigits: 9,
  name: "Internet Of Value Token",
  ticker: "IOV",
  denom: "IOV",
};

/**
 * This class simulates a live connection to a star1 prefixed chain.
 **/
class IovnsConnection implements BlockchainConnection {
  public static async establish(chainId: ChainId, codec: CosmWasmCodec): Promise<IovnsConnection> {
    return new IovnsConnection(chainId, codec);
  }

  public readonly chainId: ChainId;
  public readonly codec: CosmWasmCodec;

  public constructor(chainId: ChainId, codec: CosmWasmCodec) {
    this.chainId = chainId;
    this.codec = codec;
  }

  public disconnect(): void {
    // no-op
  }

  public async height(): Promise<number> {
    return 0;
  }

  public async postTx(bytes: PostableBytes): Promise<PostTxResponse> {
    throw new Error("postTx() is not implemented.");
  }

  public async getToken(searchTicker: TokenTicker): Promise<Token | undefined> {
    return undefined;
  }

  public async getAllTokens(): Promise<readonly Token[]> {
    return [
      {
        tokenTicker: bankToken.ticker as TokenTicker,
        tokenName: bankToken.name,
        fractionalDigits: bankToken.fractionalDigits,
      },
    ];
  }

  public async getAccount(query: AccountQuery): Promise<Account | undefined> {
    return undefined;
  }

  public async getNonce(_: AddressQuery | PubkeyQuery): Promise<Nonce> {
    return 0 as Nonce;
  }

  public async getNonces(_: AddressQuery | PubkeyQuery, count: number): Promise<readonly Nonce[]> {
    throw new Error("getNonces() is not implemented.");
  }

  public watchAccount(query: AccountQuery): Stream<Account | undefined> {
    throw new Error("watchAccount() is not implemented.");
  }

  public async getBlockHeader(height: number): Promise<BlockHeader> {
    return {
      id: "0" as BlockId,
      height: 0,
      time: new Date(0),
      transactionCount: 0,
    };
  }

  public watchBlockHeaders(): Stream<BlockHeader> {
    throw new Error("watchBlockHeaders() is not implemented.");
  }

  public async getTx(id: TransactionId): Promise<ConfirmedAndSignedTransaction<UnsignedTransaction>> {
    throw new Error("getTx() is not implemented.");
  }

  public async searchTx(
    query: TransactionQuery,
  ): Promise<readonly ConfirmedTransaction<UnsignedTransaction>[]> {
    throw new Error("searchTx() is not implemented.");
  }

  public listenTx(
    _: TransactionQuery,
  ): Stream<ConfirmedTransaction<UnsignedTransaction> | FailedTransaction> {
    throw new Error("listenTx() is not implemented.");
  }

  public liveTx(
    query: TransactionQuery,
  ): Stream<ConfirmedTransaction<UnsignedTransaction> | FailedTransaction> {
    throw new Error("liveTx() is not implemented.");
  }

  public async getFeeQuote(tx: UnsignedTransaction): Promise<Fee> {
    throw new Error("getFeeQuote() is not implemented.");
  }

  public async withDefaultFee<T extends UnsignedTransaction>(transaction: T): Promise<T> {
    return { ...transaction, fee: await this.getFeeQuote(transaction) };
  }
}

export function createStar1Connector(chainSpec: ChainSpec): ChainConnector {
  const codec = new CosmWasmCodec(addressPefix, [bankToken]);

  return {
    establishConnection: async (): Promise<BlockchainConnection> => {
      return new IovnsConnection(chainSpec.chainId, codec);
    },
    codec: codec,
    expectedChainId: chainSpec.chainId,
  };
}
