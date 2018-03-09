import React, { PureComponent, Fragment } from 'react';

import DialogControl, { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import NewFile from './NewFile';
import LoadFiles from './LoadFiles';
import Loader from './Loader';

export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <DialogControl>
        {({ selectedDialog, ...rest }) => (
          <Fragment>
            { selectedDialog === FILE_LIST && <LoadFiles {...rest} /> }
            { selectedDialog === NEW_FILE && <NewFile {...rest} />  }
            { selectedDialog === LOADING && <Loader {...rest} />  }
          </Fragment>
        )}
      </DialogControl>
    );
  }
}
