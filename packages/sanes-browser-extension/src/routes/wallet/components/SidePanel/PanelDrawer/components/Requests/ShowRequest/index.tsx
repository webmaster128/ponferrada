import * as React from "react";

import { RequestContext } from "../../../../../../../../context/RequestProvider";
import {
  GetIdentitiesResponseData,
  isGetIdentitiesResponseData,
  isSignAndPostResponseData,
  Request,
  SignAndPostResponseData,
} from "../../../../../../../../extension/background/model/requestsHandler/requestQueueManager";
import ShareIdentity from "./ShareIdentity";
import SignAndPostTx from "./SignAndPostTx";

interface Props {
  readonly goBackToList: () => void;
}

const ShowRequest = ({ goBackToList }: Props): JSX.Element => {
  const requestContext = React.useContext(RequestContext);

  const firstRequest = requestContext.requests.find(() => true);
  if (!firstRequest) throw new Error("Did not find an authorization request");

  const isIdentitiesRequest = isGetIdentitiesResponseData(firstRequest.responseData);
  const isSignAndPostRequest = isSignAndPostResponseData(firstRequest.responseData);

  const closeExtension = (): void => {
    if (requestContext.requests.length === 0) {
      goBackToList();
      window.close();
    } else {
      goBackToList();
    }
  };

  return (
    <React.Fragment>
      {isIdentitiesRequest && (
        <ShareIdentity
          request={firstRequest as Request<GetIdentitiesResponseData>}
          closeExtension={closeExtension}
        />
      )}
      {isSignAndPostRequest && (
        <SignAndPostTx
          request={firstRequest as Request<SignAndPostResponseData>}
          closeExtension={closeExtension}
        />
      )}
    </React.Fragment>
  );
};

export default ShowRequest;
