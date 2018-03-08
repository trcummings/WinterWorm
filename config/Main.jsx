import React, { PureComponent } from 'react';

import DialogControl, { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import NewFile from './NewFile';
import LoadFiles from './LoadFiles';
import Loader from './Loader';

export default class Main extends PureComponent { // eslint-disable-line
  render() {
    return (
      <DialogControl>
        {({ selectedDialog, ...rest }) => (
          <div style={{ height: '100%', width: '100%' }}>
            { selectedDialog === FILE_LIST && <LoadFiles {...rest} /> }
            { selectedDialog === NEW_FILE && <NewFile {...rest} />  }
            { selectedDialog === LOADING && <Loader {...rest} />  }
          </div>
        )}
      </DialogControl>
    );
  }
}
