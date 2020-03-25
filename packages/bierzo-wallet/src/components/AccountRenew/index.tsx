import { ChainId, Fee, TransactionId } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { Typography } from "medulas-react-components";
import React from "react";

import { RpcEndpoint } from "../../communication/rpcEndpoint";
import { BwAccountWithChainName } from "../AccountManage";
import AccountOperation from "../AccountOperation";

interface HeaderProps {
  readonly account: BwAccountWithChainName;
}

const Header: React.FunctionComponent<HeaderProps> = ({ account }): JSX.Element => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are about to renew{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline>
      {account.name}*{account.domain}
    </Typography>
  </React.Fragment>
);

interface Props {
  readonly id: string;
  readonly account: BwAccountWithChainName;
  readonly children: React.ReactNode;
  readonly bnsChainId: ChainId;
  readonly onCancel: () => void;
  readonly getFee: () => Promise<Fee | undefined>;
  readonly getRequest: () => Promise<JsonRpcRequest>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly setTransactionId: React.Dispatch<React.SetStateAction<TransactionId | null>>;
}

const AccountRenew: React.FunctionComponent<Props> = ({
  account,
  id,
  onCancel,
  getFee,
  getRequest,
  bnsChainId,
  children,
  rpcEndpoint,
  setTransactionId,
}): JSX.Element => {
  const getRenewRequest = async (): Promise<JsonRpcRequest> => {
    return await getRequest();
  };

  const getRenewFee = async (): Promise<Fee | undefined> => {
    return await getFee();
  };

  return (
    <AccountOperation
      id={id}
      submitCaption="Renew"
      onCancel={onCancel}
      getFee={getRenewFee}
      getRequest={getRenewRequest}
      bnsChainId={bnsChainId}
      rpcEndpoint={rpcEndpoint}
      setTransactionId={setTransactionId}
      header={<Header account={account} />}
    >
      {children}
    </AccountOperation>
  );
};

export default AccountRenew;
