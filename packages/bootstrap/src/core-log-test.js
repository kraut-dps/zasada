import core from '@zasada/core';
import log from '@zasada/log';
import test from '@zasada/test';

core.newError = log.newError;
test.oneLinker = core.oneLinker;
let oRoot = {
  core,
  log,
  test
};
oRoot.log.init();
export { oRoot as default };