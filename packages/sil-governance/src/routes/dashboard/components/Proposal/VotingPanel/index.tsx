import { ProposalResult, VoteOption } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { voteToString } from "ui-logic";

import { Tally } from "../../../../../store/proposals";
import Buttons from "./Buttons";
import ParticipationData from "./ParticipationData";
import ResultFlair from "./ResultFlair";

interface Props {
  readonly result: ProposalResult;
  readonly vote: VoteOption | undefined;
  readonly id: number;
  readonly quorum: number;
  readonly threshold: number;
  readonly tally: Tally;
  readonly hasStarted: boolean;
  readonly hasEnded: boolean;
}

const VotingPanel = ({
  result,
  vote,
  id,
  quorum,
  threshold,
  tally,
  hasStarted,
  hasEnded,
}: Props): JSX.Element => {
  const voteText = voteToString(vote);

  return (
    <Block minWidth="160px" margin={2} display="flex" flexDirection="column">
      {hasEnded && <ResultFlair result={result} />}
      {hasStarted && <Typography variant="body2">Your vote: {voteText}</Typography>}
      {hasStarted && !hasEnded && <Buttons id={id} vote={vote} />}
      <ParticipationData quorum={quorum} threshold={threshold} tally={tally} />
    </Block>
  );
};

export default VotingPanel;
