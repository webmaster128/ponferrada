import { Block } from "medulas-react-components";
import React from "react";
import * as ReactRedux from "react-redux";
import { RootState } from "store/reducers";

import { AccountProps } from "..";
import { history } from "../..";
import PageMenu from "../../../components/PageMenu";
import { TRANSACTIONS_ROUTE } from "../../paths";
import ConfirmTransfer from "./components/ConfirmTransfer";
import IovnameAccountTransfer from "./components/IovnameTransfer";
import NameAccountTransfer from "./components/NameTransfer";
import NameAccountTransferBack from "./components/NameTransferBack";
import StarnameAccountTransfer from "./components/StarnameTransfer";

function onSeeTransactions(): void {
  history.push(TRANSACTIONS_ROUTE);
}

interface AccountTransferEntity {
  entity: "name-back";
}

type AccountTransferProps = AccountProps | AccountTransferEntity;

const AccountTransfer = ({ entity }: AccountTransferProps): React.ReactElement => {
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const rpcEndpoint = ReactRedux.useSelector((state: RootState) => state.rpcEndpoint);

  if (!rpcEndpoint) throw new Error("RPC endpoint not set in redux store. This is a bug.");

  return (
    <PageMenu>
      {transactionId ? (
        <ConfirmTransfer transactionId={transactionId} onSeeTransactions={onSeeTransactions} />
      ) : (
        <Block
          marginTop={4}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {entity === "iovname" && (
            <IovnameAccountTransfer rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
          {entity === "starname" && (
            <StarnameAccountTransfer rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
          {entity === "name" && (
            <NameAccountTransfer rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
          {entity === "name-back" && (
            <NameAccountTransferBack rpcEndpoint={rpcEndpoint} setTransactionId={setTransactionId} />
          )}
        </Block>
      )}
    </PageMenu>
  );
};

export default AccountTransfer;
