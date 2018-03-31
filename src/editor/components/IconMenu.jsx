// @flow
import React, { PureComponent } from 'react';

import { Manager, Target, Popper } from 'react-popper';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Collapse from 'material-ui/transitions/Collapse';
import { MenuItem, MenuList } from 'material-ui/Menu';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import Portal from 'material-ui/Portal';
import Paper from 'material-ui/Paper';

export type ListItem = {
  label: string,
  onClick: () => void
};

type Props = {
  listItems: Array<ListItem>,
};

type State = {
  open: boolean
};

const ICON_MENU = 'icon-menu';

export default class IconMenu extends PureComponent<Props, State> {
  props: Props;
  state: State;
  target: ?HTMLDivElement

  static defaultProps = {
    listItems: [],
  }

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClose = (event: SyntheticEvent<>) => {
    if (!this.target || this.target.contains(event.target)) return;
    this.setState({ open: false });
  };

  render() {
    const { listItems } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Manager>
          <Target>
            <div ref={ref => (this.target = ref)}>
              <IconButton
                aria-owns={open ? ICON_MENU : null}
                aria-haspopup="true"
                onClick={this.handleToggle}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          </Target>
          <Portal>
            <Popper
              placement="bottom"
              eventsEnabled={open}
              style={{ pointerEvents: !open ? 'none' : undefined }}
            >
              <ClickAwayListener onClickAway={this.handleClose}>
                <Collapse in={open} id={ICON_MENU} style={{ transformOrigin: '0 0 0' }}>
                  <Paper style={{ margin: 3 }}>
                    <MenuList role="menu">
                      { listItems.map(({ label, onClick }) => (
                        <MenuItem
                          key={label} onClick={() => {
                            onClick();
                            this.handleToggle();
                          }}
                        >
                          {label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Paper>
                </Collapse>
              </ClickAwayListener>
            </Popper>
          </Portal>
        </Manager>
      </div>
    );
  }
}
