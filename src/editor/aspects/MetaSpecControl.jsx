import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSpecsOfType, setSpec as setSpecOfType } from '../modules/specs';

const mapStateToProps = (state, ownProps) => ({
  specs: getSpecsOfType(state, ownProps),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setSpec: setSpecOfType,
}, dispatch);

export class MetaSpecControl extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    specType: PropTypes.string.isRequired,
    setSpec: PropTypes.func.isRequired,
    specs: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  }

  setSpec = options => (
    this.props.setSpec({ type: this.props.specType, options })
  );

  render() {
    const { children, specs } = this.props;

    return children({ specs, setSpec: this.setSpec });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaSpecControl);
