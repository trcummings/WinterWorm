// 
import React, { PureComponent } from 'react';
import hoistStatics from 'hoist-non-react-statics';

const getDisplayName = (BaseComponent: React.Element) =>
  BaseComponent.displayName || BaseComponent.name || 'Component';

const hofToHoc = (HOF, namespace, staticProps = {}) => (
  BaseComponent => hoistStatics((
    class HofToHoc extends PureComponent {
      static displayName = `HofToHoc(${getDisplayName(HOF)})`;

      renderChild = (...args) => (
        <BaseComponent
          {...this.props}
          {...(namespace ? { [namespace]: args[0] } : args[0])}
        />
      )

      render() {
        return (
          <HOF {...this.props} {...staticProps}>
            { this.renderChild }
          </HOF>
        );
      }
    }
  ), BaseComponent)
);

export default hofToHoc;
