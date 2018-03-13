import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

if (process.env.IS_DEV) {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => {
      console.log(`Added Extension:  ${name}`);
    })
    .catch((err) => {
      console.log('An error occurred: ', err);
    });
}
