import clipboardCopy from "clipboard-copy";
import {
  Block,
  Button,
  Image,
  makeStyles,
  ToastContext,
  ToastVariant,
  Typography,
} from "medulas-react-components";
import React from "react";

import copySvg from "../../../../assets/copy.svg";
import tickSvg from "../../../../assets/tick.svg";
import PageContent from "../../../../components/PageContent";

export const TRANSFER_CONFIRMATION_VIEW_ID = "transfer-confirmation-view-id";

const useClasses = makeStyles({
  txId: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  copyButton: {
    cursor: "pointer",
  },
});

const tickIcon = <Image src={tickSvg} alt="Tick" />;
const copyIcon = <Image src={copySvg} alt="Copy" />;

interface Props {
  readonly transactionId: string;
  readonly onSeeTransactions: () => void;
}

const ConfirmTransfer = ({ transactionId, onSeeTransactions }: Props): React.ReactElement => {
  const toast = React.useContext(ToastContext);
  const classes = useClasses();

  const buttons = (
    <Block
      marginTop={4}
      marginBottom={1}
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Block width="75%">
        <Button fullWidth onClick={onSeeTransactions}>
          See Transactions
        </Button>
      </Block>
    </Block>
  );

  const copyTxId = (): void => {
    clipboardCopy(transactionId);
    toast.show("Address has been copied to clipboard.", ToastVariant.INFO);
  };

  return (
    <PageContent id={TRANSFER_CONFIRMATION_VIEW_ID} icon={tickIcon} avatarColor="#31E6C9" buttons={buttons}>
      <Typography color="textPrimary" variant="subtitle1" weight="semibold" align="center">
        Your transfer request was successfully signed and sent to the network.
      </Typography>
      <Block marginTop={4} alignSelf="flex-start">
        <Typography color="textPrimary" variant="subtitle2" weight="semibold">
          Transaction ID
        </Typography>
      </Block>
      <Block marginTop={2} alignSelf="flex-start" display="flex" alignItems="center">
        <Typography color="textPrimary" variant="subtitle2" className={classes.txId}>
          {transactionId}
        </Typography>
        <Block marginLeft={1} onClick={copyTxId} className={classes.copyButton}>
          {copyIcon}
        </Block>
      </Block>
    </PageContent>
  );
};

export default ConfirmTransfer;
