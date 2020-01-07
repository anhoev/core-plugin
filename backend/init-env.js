const vueRuntimeHelpers = require('vue-runtime-helpers');
const Vue = require('vue');

module.exports = function () {
  const _normalizeComponent = vueRuntimeHelpers.normalizeComponent;
  vueRuntimeHelpers.normalizeComponent = function () {
    const args = [...arguments];
    args[7] = undefined
    args[8] = vueRuntimeHelpers.createInjectorSSR
    args[3] = args[3] || 'scope-id'
    args[5] = args[3]
    return _normalizeComponent(...args);
  }

  global['vue'] = Vue;
  global['vue-runtime-helpers'] = vueRuntimeHelpers;
}
