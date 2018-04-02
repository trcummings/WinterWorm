// @flow
import React, { PureComponent } from 'react';

type Props = {
};

export default class DisplayContainerable extends PureComponent<Props> {
  props: Props;

  pickContainer = (event: SyntheticEvent<HTMLSelectElement>) => (
    this.props.updateComponentState({ displayType: event.currentTarget.value })
  )

  render() {
    const { componentState: { displayType }, contract = {} } = this.props;

    return (
      <div>
        <select value={displayType} onChange={this.pickContainer}>
          <option value="">Select Display Type</option>
          { contract.displayType.in.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>
    );
  }
}
