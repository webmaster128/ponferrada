import { SetValidatorsAction } from "@iov/bns";
import { Block, Typography } from "medulas-react-components";
import React from "react";
import { ellipsifyMiddle } from "ui-logic";

interface Props {
  readonly action: SetValidatorsAction;
}

const SetValidators = ({ action }: Props): JSX.Element => {
  const validators = Object.entries(action.validatorUpdates).map(([validator, props]) => {
    const validatorLabel = `Validator ${ellipsifyMiddle(validator, 40)} -`;

    return (
      <Block key={validator} marginTop={0.5} marginBottom={1}>
        <Typography variant="body2">
          {validatorLabel} Power {props.power}
        </Typography>
      </Block>
    );
  });

  return (
    <Block marginTop={2} marginBottom={2}>
      <Typography variant="body2" weight="semibold">
        Updates validators:
      </Typography>
      <Block marginTop={0.5}>{validators}</Block>
    </Block>
  );
};

export default SetValidators;
