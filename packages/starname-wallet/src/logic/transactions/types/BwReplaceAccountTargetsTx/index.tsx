import { ReplaceAccountTargetsTx } from "@iov/bns";
import * as React from "react";

import { BwParser, ProcessedTx } from "../BwParser";
import TransactionHeader from "./ui/TransactionHeader";
import TransactionRow from "./ui/TransactionRow";

export class BwReplaceAccountTargetsParser extends BwParser<ReplaceAccountTargetsTx> {
  public graphicalRepresentation(tx: ProcessedTx<ReplaceAccountTargetsTx>): React.ReactElement {
    return <TransactionRow key={tx.id} tx={tx} />;
  }

  public headerRepresentation(
    tx: ProcessedTx<ReplaceAccountTargetsTx>,
    lastOne: boolean,
  ): React.ReactElement {
    return <TransactionHeader key={tx.id} item={tx} lastOne={lastOne} />;
  }
}
