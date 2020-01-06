const jsonfn = require('json-fn')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const Vue = require('vue')
const vueRuntimeHelpers = require('vue-runtime-helpers')
const renderer = require('vue-server-renderer').createRenderer({
  template: '<!DOCTYPE html><html lang="en"><head><title>template</title></head><body><!--vue-ssr-outlet--></body></html>'
});
const _ = require('lodash')

vueRuntimeHelpers.createInjector = vueRuntimeHelpers.createInjectorSSR;
global['vue'] = Vue
global['vue-runtime-helpers'] = vueRuntimeHelpers
global['dayjs'] = dayjs

dayjs.extend(customParseFormat)

module.exports = async (cms) => {
  global['cms'] = cms
  cms.api.processData = processDataFn

  cms.socket.on('connect', socket => {
    socket.on('processData', processDataFn);
  })

  async function processDataFn(reportName, input, callback) {
    try {
      input = jsonfn.clone(input, true, true);

      const processData = jsonfn.clone(await cms.getModel('ProcessData').findOne({name: reportName}), true, true);

      cms.models = cms.models || {}
      cms.models[processData.collections] = cms.getModel(processData.collections)

      const ProcessData = require('../dist/ProcessData.vue')

      const component = new Vue({
        components: {ProcessData},
        render(h) {
          return h('ProcessData', {
            props: {model: processData, onlyData: true}, attrs: input, on: {
              processFinish: (_scope) => {
                if (_.isEmpty(processData.output)) return callback(_scope);
                const scope = _.pick(_scope, [...processData.output, ...Object.keys(input)])
                return callback(scope);
              }
            }
          })
        }
      })

      renderer.renderToString(component, {}, async (err, html) => {
        if (err) callback(err)
      })
    } catch (e) {
      callback(e)
    }
  }

  // processDataFn('OrderRevenue', {
  //   from: dayjs('25.12.2019', 'DD.MM.YYYY').toDate(),
  //   to: dayjs('28.12.2019', 'DD.MM.YYYY').toDate()
  // }, result => {
  //   debugger
  // })
}
