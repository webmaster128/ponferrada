import { FormApi } from "final-form";
import {
  Block,
  composeValidators,
  FieldInputValue,
  greaterOrEqualThan,
  required,
  SelectField,
  SelectFieldItem,
  TextField,
  Typography,
} from "medulas-react-components";
import React, { useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";

export const COMMITTEE_ADD_FIELD = "Committee";
const COMMITTEE_ADD_INITIAL = "Select a committee";

export const MEMBER_ADD_FIELD = "New Member Address";
const MEMBER_ADD_PLACEHOLDER = "Enter the address for the new member";

export const WEIGHT_FIELD = "Weight";
const WEIGHT_MIN_VALUE = 1;
const WEIGHT_PLACEHOLDER = WEIGHT_MIN_VALUE.toString();

interface Props {
  readonly form: FormApi;
}

const AddCommitteeMember = ({ form }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [committeeItems, setCommitteeItems] = useState<SelectFieldItem[]>([]);

  useEffect(() => {
    const updateCommitteeItems = async (): Promise<void> => {
      if (!governor) throw new Error("Governor not set in store. This is a bug.");
      const allElectorates = await governor.getElectorates(true);
      const committeeItems = allElectorates.map(electorate => {
        return {
          name: `${electorate.id}: ${electorate.title}`,
        };
      });

      setCommitteeItems(committeeItems);
    };

    updateCommitteeItems();
  }, [governor]);

  const committeeValidator = (value: FieldInputValue): string | undefined => {
    if (value === COMMITTEE_ADD_INITIAL) return "Must select a committee";
    return undefined;
  };

  const weightValidator = composeValidators(required, greaterOrEqualThan(WEIGHT_MIN_VALUE));

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_ADD_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectField
            fieldName={COMMITTEE_ADD_FIELD}
            form={form}
            validate={committeeValidator}
            fullWidth
            items={committeeItems}
            initial={COMMITTEE_ADD_INITIAL}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_ADD_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextField
            name={MEMBER_ADD_FIELD}
            form={form}
            validate={required}
            placeholder={MEMBER_ADD_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{WEIGHT_FIELD}</Typography>
        <Block marginLeft={2}>
          <TextField
            name={WEIGHT_FIELD}
            form={form}
            type="number"
            validate={weightValidator}
            placeholder={WEIGHT_PLACEHOLDER}
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default AddCommitteeMember;
