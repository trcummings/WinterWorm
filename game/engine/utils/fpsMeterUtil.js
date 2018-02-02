export const setUpFpsMeter = () => {
  require('../../vendor/fpsMeter'); // eslint-disable-line
  window.meter = new window.FPSMeter();
};
