import { ToastContext } from 'medulas-react-components/lib/context/ToastProvider';
import { ToastVariant } from 'medulas-react-components/lib/context/ToastProvider/Toast';
import PageColumn from 'medulas-react-components/lib/pages/PageColumn';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import { Dispatch } from 'redux';

import { history } from '..';
import { drinkFaucetIfNeeded } from '../../logic/faucet';
import { addBalancesAction, getBalances } from '../../store/balances';
import { getExtensionStatus, setExtensionStateAction } from '../../store/extension';
import { addTickersAction, getTokens } from '../../store/tokens';
import { addUsernamesAction, getUsernames } from '../../store/usernames/actions';
import { BALANCE_ROUTE } from '../paths';

export const INSTALL_EXTENSION_MSG = 'You need to install IOV extension.';
export const LOGIN_EXTENSION_MSG = 'Please login to the IOV extension to continue.';

export const loginBootSequence = async (
  keys: { [chain: string]: string },
  dispatch: Dispatch,
): Promise<void> => {
  const chainTokens = await getTokens();
  dispatch(addTickersAction(chainTokens));

  await drinkFaucetIfNeeded(keys);

  const balances = await getBalances(keys);
  dispatch(addBalancesAction(balances));

  const usernames = await getUsernames(keys);
  dispatch(addUsernamesAction(usernames));
};

const Login = (): JSX.Element => {
  const toast = React.useContext(ToastContext);
  //TODO: Fix this as soon as proper react-redux definitions will be available
  const dispatch = (ReactRedux as any).useDispatch();
  const store = ReactRedux.useStore();

  const onLogin = async (_: object): Promise<void> => {
    const result = await getExtensionStatus();
    dispatch(setExtensionStateAction(result.connected, result.installed, result.keys));

    if (!result.installed) {
      toast.show(INSTALL_EXTENSION_MSG, ToastVariant.ERROR);
      return;
    }

    if (!result.connected) {
      toast.show(LOGIN_EXTENSION_MSG, ToastVariant.ERROR);
      return;
    }

    const keys = store.getState().extension.keys;
    await loginBootSequence(keys, dispatch);

    history.push(BALANCE_ROUTE);
  };

  return (
    <PageColumn
      icon="white"
      onSubmit={onLogin}
      primaryTitle="Welcome"
      secondaryTitle="to your IOV wallet"
      subtitle="Continue to access your account"
      nextMsg="Continue"
    />
  );
};

export default Login;
