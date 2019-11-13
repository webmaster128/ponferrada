import * as React from "react";

import {
  Request,
  SignAndPostResponseData,
} from "../../../../../../../../../extension/background/model/requestsHandler/requestQueueManager";
import RejectTx from "./RejectTx";
import ShowTx from "./ShowTx";

interface Props {
  readonly request: Request<SignAndPostResponseData>;
  readonly goBackToList: () => void;
}

const SignAndPostTx = ({ request, goBackToList }: Props): JSX.Element => {
  const [action, setAction] = React.useState<"show" | "reject">("show");
  const { senderUrl, responseData, accept, reject } = request;

  const showRequestView = (): void => setAction("show");
  const showRejectView = (): void => setAction("reject");

  const onAcceptRequest = (): void => {
    accept();
    goBackToList();
  };

  const onRejectRequest = (permanent: boolean): void => {
    reject(permanent);
    goBackToList();
  };

  return (
    <React.Fragment>
      {action === "show" && (
        <ShowTx
          tx={responseData.tx}
          sender={senderUrl}
          onAcceptRequest={onAcceptRequest}
          showRejectView={showRejectView}
        />
      )}
      {action === "reject" && (
        <RejectTx sender={senderUrl} onBack={showRequestView} onRejectRequest={onRejectRequest} />
      )}
    </React.Fragment>
  );
};

export default SignAndPostTx;
