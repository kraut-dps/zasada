// core-log
import log from '@zasada/log';
import core from '@zasada/core';

core.newError = log.newError;
let oRoot = {
  core,
  log
};
oRoot.log.init();
export { oRoot as default };