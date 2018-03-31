// @flow
import React from 'react';

import IconMenu, { type ListItem } from './IconMenu';

type Props = {
  label: string,
  listItems?: Array<ListItem>
};

const TitleMenu = ({ label, listItems = [] }: Props) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <h4 style={{ padding: '.5em', margin: 0 }}>{ label }</h4>
    <IconMenu listItems={listItems} />
  </div>
);

export default TitleMenu;
