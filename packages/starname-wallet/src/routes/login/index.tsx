import { getExtensionStatus } from "communication/extension";
import { extensionRpcEndpoint } from "communication/extensionRpcEndpoint";
import { ledgerRpcEndpoint } from "communication/ledgerRpcEndpoint";
import LedgerBillboardMessage from "components/BillboardMessage/LedgerBillboardMessage";
import NeumaBillboardMessage from "components/BillboardMessage/NeumaBillboardMessage";
import { getConfig, makeExtendedIdentities } from "config";
import { Target } from "logic/api";
import { BillboardContext, ToastContext, ToastVariant } from "medulas-react-components";
import * as React from "react";
import * as ReactRedux from "react-redux";
import { Dispatch } from "redux";
import PageColumn from "routes/login/components/PageColumn";
import { getBalances, setBalancesAction } from "store/balances";
import { setIdentities } from "store/identities";
import { setRpcEndpoint } from "store/rpcendpoint";
import { addTickersAction, getTokens } from "store/tokens";
import { ErrorParser } from "ui-logic";

import { history } from "..";
import { BALANCE_ROUTE } from "../paths";

export const loginBootSequence = async (targets: readonly Target[], dispatch: Dispatch): Promise<void> => {
  const chains = (await getConfig()).chains;
  for (const target of targets) {
    const chain = chains.find(chain => chain.chainSpec.chainId === target.id);
    if (!chain) {
      throw new Error(`Chain with ${target.id} was not found.`);
    }
  }
  const chainTokens = await getTokens();
  dispatch(addTickersAction(chainTokens));
  // Do not block the use of the wallet just because the faucet might take
  // some time send tokens
  // drinkFaucetIfNeeded(targets).catch(console.error);
  const balances = await getBalances(targets);
  // await subscribeTransaction(targets, dispatch);
  dispatch(setBalancesAction(balances));
};

async function onGetNeumaExtension(): Promise<void> {
  const config = await getConfig();
  window.open(config.extensionLink, "_blank");
}

const Login = (): React.ReactElement => {
  const billboard = React.useContext(BillboardContext);
  const toast = React.useContext(ToastContext);
  const dispatch = ReactRedux.useDispatch();

  const onLoginWithNeuma = async (): Promise<void> => {
    try {
      billboard.show(
        <NeumaBillboardMessage text={extensionRpcEndpoint.authorizeGetIdentitiesMessage} />,
        "start",
        "flex-end",
        100,
      );
      const { installed, connected } = await getExtensionStatus();
      if (!installed) {
        toast.show(extensionRpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else if (!connected) {
        toast.show(extensionRpcEndpoint.noMatchingIdentityMessage, ToastVariant.ERROR);
      } else {
        // dispatch(setIdentities(await makeExtendedIdentities(identities)));
        dispatch(setRpcEndpoint(extensionRpcEndpoint));
        await loginBootSequence([], dispatch);
        history.push(BALANCE_ROUTE);
      }
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  const onLoginWithLedger = async (): Promise<void> => {
    try {
      billboard.show(
        <LedgerBillboardMessage text={ledgerRpcEndpoint.authorizeGetIdentitiesMessage} />,
        "center",
        "center",
        100,
      );
      const targets: Target[] | undefined = await ledgerRpcEndpoint.getTargets();
      if (targets === undefined) {
        toast.show(ledgerRpcEndpoint.notAvailableMessage, ToastVariant.ERROR);
      } else if (targets.length === 0) {
        toast.show(ledgerRpcEndpoint.noMatchingIdentityMessage, ToastVariant.ERROR);
      } else {
        dispatch(setIdentities(await makeExtendedIdentities(targets)));
        dispatch(setRpcEndpoint(ledgerRpcEndpoint));
        await loginBootSequence(targets, dispatch);
        history.push(BALANCE_ROUTE);
      }
    } catch (error) {
      console.error(error);
      const message = ErrorParser.tryParseWeaveError(error) || "An unknown error occurred";
      toast.show(message, ToastVariant.ERROR);
    } finally {
      billboard.close();
    }
  };

  return (
    <PageColumn
      onLoginWithNeuma={onLoginWithNeuma}
      onLoginWithLedger={onLoginWithLedger}
      onGetNeumaExtension={onGetNeumaExtension}
    />
  );
};

export default Login;
