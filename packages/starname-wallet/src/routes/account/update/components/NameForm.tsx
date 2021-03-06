import { Fee } from "@iov/bcp";
import { RpcEndpoint } from "communication/rpcEndpoint";
import { BwAccountWithChainName } from "components/AccountManage";
import { ChainAddressPairWithName } from "components/AddressesTable";
import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";
import React, { Dispatch, SetStateAction } from "react";
import { NAME_MANAGE_ROUTE } from "routes/paths";
import { ErrorParser } from "ui-logic";

import { history } from "../../..";
import AccountEdit from "../../../../components/AccountEdit";

export interface Props {
  readonly setTransactionId: Dispatch<SetStateAction<string | null>>;
  readonly rpcEndpoint: RpcEndpoint;
  readonly chainAddresses: readonly ChainAddressPairWithName[];
}

const NameAccountUpdate = ({ rpcEndpoint, chainAddresses }: Props): React.ReactElement => {
  const account: BwAccountWithChainName = history.location.state;

  const onReturnToManage = (): void => {
    history.push(NAME_MANAGE_ROUTE, account);
  };

  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);

  const getFee = async (/* values: FormValues */): Promise<Fee | undefined> => {
    /* const addressesToRegister = getChainAddressPairsFromValues(values, chainAddresses);

    return (
      await generateReplaceAccountTargetsTxWithFee(
        bnsIdentity,
        account.name,
        account.domain,
        addressesToRegister,
      )
    ).fee;*/
    return {} as Fee;
  };

  const onSubmit = async (/* values: object */): Promise<void> => {
    if (!rpcEndpoint) throw Error("No rpcEndpoint found for submit");
    try {
      /* const request = await generateReplaceAccountTargetsTxRequest(
        bnsIdentity,
        account.name,
        account.domain,
        addressesToRegister,
      );

      if (rpcEndpoint.type === "extension") {
        billboard.show(
          <NeumaBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "start",
          "flex-end",
          0,
        );
      } else {
        billboard.show(
          <LedgerBillboardMessage text={rpcEndpoint.authorizeSignAndPostMessage} />,
          "center",
          "center",
          0,
        );
      }
      const transactionId = await rpcEndpoint.sendSignAndPostRequest(request);
      if (transactionId === undefined) {
        toast.show(rpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else if (transactionId === null) {
        toast.show("Request rejected", ToastVariant.ERROR);
      } else {
        setTransactionId(transactionId);
      }*/
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <AccountEdit
      chainAddresses={chainAddresses}
      account={account}
      onCancel={onReturnToManage}
      getFee={getFee}
      onSubmit={onSubmit}
    />
  );
};

export default NameAccountUpdate;
