export const setUpFpsMeter = (setUpMeter = true) => {
  if (setUpMeter) {
    require('../../vendor/fpsMeter'); // eslint-disable-line
    window.meter = new window.FPSMeter();
  }
  else {
    window.meter = {
      tick: () => {},
      tickStart: () => {},
      tickEnd: () => {},
    };
  }
};
