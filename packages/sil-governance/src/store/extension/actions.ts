import { Governor } from "@iov/bns-governance";

import { sendGetIdentitiesRequest } from "../../communication/identities";
import { getBnsConnection } from "../../logic/connection";
import { ExtensionState, SetExtensionStateActionType } from "./reducer";

export async function getExtensionStatus(): Promise<ExtensionState> {
  const identities = await sendGetIdentitiesRequest();

  if (!identities) {
    return { installed: false, connected: false, governor: undefined };
  }

  if (identities.length === 0) {
    return { installed: true, connected: false, governor: undefined };
  }

  const connection = await getBnsConnection();
  const identity = identities[0];
  const governor = new Governor({ connection, identity });

  return {
    installed: true,
    connected: true,
    governor,
  };
}

export const setExtensionStateAction = (
  connected: boolean,
  installed: boolean,
  governor: Governor | undefined,
): SetExtensionStateActionType => ({
  type: "@@extension/SET_STATE",
  payload: { connected, installed, governor },
});