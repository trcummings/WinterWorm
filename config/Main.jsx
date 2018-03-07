import React from 'react';

import DialogControl, { FILE_LIST, NEW_FILE, LOADING } from './DialogControl';
import NewFile from './NewFile';
import LoadFiles from './LoadFiles';
import Loader from './Loader';

const Main = () => (
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

export default Main;
