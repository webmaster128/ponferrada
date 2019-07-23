import { Identity, UnsignedTransaction } from '@iov/bcp';
import { JsonRpcResponse } from '@iov/jsonrpc';
import { JsonRpcSigningServer, MultiChainSigner, SigningServerCore } from '@iov/multichain';

import { generateErrorResponse } from '../../errorResponseGenerator';
import { isSupportedTransaction } from '../persona';
import { getConfigurationFile } from '../persona/config';
import { requestCallback } from './requestCallback';
import {
  GetIdentitiesData,
  isRequestMeta,
  Request,
  RequestMeta,
  RequestQueueManager,
  SignAndPostData,
  UiIdentity,
} from './requestQueueManager';
import { SenderWhitelist } from './senderWhitelist';

export default class SigningServer {
  private requestHandler = new RequestQueueManager();
  private senderWhitelist = new SenderWhitelist();
  private signingServer: JsonRpcSigningServer | undefined;

  public getIdentitiesCallback = (signer: MultiChainSigner) => async (
    reason: string,
    matchingIdentities: ReadonlyArray<Identity>,
    meta: any,
  ) => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }
    const { senderUrl } = meta;
    const chainNames = (await getConfigurationFile()).names;

    const requestedIdentities = matchingIdentities.map(
      (matchedIdentity): UiIdentity => {
        const chainName = chainNames[matchedIdentity.chainId];

        return {
          chainName: chainName,
          address: signer.identityToAddress(matchedIdentity),
        };
      },
    );

    const data: GetIdentitiesData = {
      senderUrl,
      requestedIdentities,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'getIdentities',
      data,
      matchingIdentities,
      [],
    );
  };

  public signAndPostCallback = (_signer: MultiChainSigner) => (
    reason: string,
    transaction: UnsignedTransaction,
    meta: any,
  ): Promise<boolean> => {
    if (!isRequestMeta(meta)) {
      throw new Error('Unexpected type of data in meta field');
    }

    if (!isSupportedTransaction(transaction)) {
      throw new Error('Unexpected unsigned transaction');
    }

    const { senderUrl } = meta;

    const data: SignAndPostData = {
      senderUrl,
      tx: transaction,
    };

    return requestCallback(
      this.requestHandler,
      this.senderWhitelist,
      reason,
      'signAndPost',
      data,
      true,
      false,
    );
  };

  public getPendingRequests(): Request[] {
    return this.requestHandler.requests();
  }

  public start(core: SigningServerCore): void {
    this.requestHandler = new RequestQueueManager();
    this.senderWhitelist = new SenderWhitelist();
    this.signingServer = new JsonRpcSigningServer(core);
  }

  public shutdown(): void {
    if (!this.signingServer) {
      throw new Error('The signing server instance is not set. This indicates a bug in the lifecycle.');
    }
    this.signingServer.shutdown();
    this.signingServer = undefined;
  }

  public async handleRequestMessage(
    request: any,
    sender: chrome.runtime.MessageSender,
  ): Promise<JsonRpcResponse> {
    const responseId = typeof request.id === 'number' ? request.id : null;
    if (!sender.url) {
      return generateErrorResponse(responseId, 'Got external message without sender URL');
    }

    if (!this.signingServer) {
      return generateErrorResponse(responseId, 'Signing server not ready');
    }

    const { url: senderUrl } = sender;
    if (this.senderWhitelist.isBlocked(senderUrl)) {
      return generateErrorResponse(responseId, 'Sender has been blocked by user');
    }

    const meta: RequestMeta = {
      senderUrl,
    };

    const response = await this.signingServer.handleUnchecked(request, meta);
    return response;
  }
}
