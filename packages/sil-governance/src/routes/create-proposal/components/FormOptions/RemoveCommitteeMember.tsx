import { FormApi } from "final-form";
import {
  Block,
  SelectFieldForm,
  SelectFieldFormItem,
  TextFieldForm,
  Typography,
} from "medulas-react-components";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import * as ReactRedux from "react-redux";

import { RootState } from "../../../../store/reducers";

export const COMMITTEE_REMOVE_FIELD = "Committee";
const COMMITTEE_REMOVE_INITIAL = "Select a committee";
export const MEMBER_REMOVE_FIELD = "Member Address to Remove";
const MEMBER_REMOVE_PLACEHOLDER = "Enter the address of the member to remove";

interface Props {
  readonly form: FormApi;
  readonly changeElectorateId: Dispatch<SetStateAction<number | undefined>>;
}

const RemoveCommitteeMember = ({ form, changeElectorateId }: Props): JSX.Element => {
  const governor = ReactRedux.useSelector((state: RootState) => state.extension.governor);
  const [committeeItems, setCommitteeItems] = useState<SelectFieldFormItem[]>([]);

  const changeCommittee = (selectedItem: SelectFieldFormItem): void => {
    const electorateId = parseInt(selectedItem.name.substring(0, selectedItem.name.indexOf(":")), 10);
    changeElectorateId(electorateId);
  };

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

  return (
    <React.Fragment>
      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{COMMITTEE_REMOVE_FIELD}</Typography>
        <Block marginLeft={2}>
          <SelectFieldForm
            fieldName={COMMITTEE_REMOVE_FIELD}
            fullWidth
            form={form}
            items={committeeItems}
            initial={COMMITTEE_REMOVE_INITIAL}
            onChangeCallback={changeCommittee}
          />
        </Block>
      </Block>

      <Block marginTop={2} display="flex" alignItems="center">
        <Typography>{MEMBER_REMOVE_FIELD}</Typography>
        <Block marginLeft={2} flexGrow={1}>
          <TextFieldForm
            name={MEMBER_REMOVE_FIELD}
            form={form}
            placeholder={MEMBER_REMOVE_PLACEHOLDER}
            fullWidth
            margin="none"
          />
        </Block>
      </Block>
    </React.Fragment>
  );
};

export default RemoveCommitteeMember;
