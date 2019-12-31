const jsonfn = require('json-fn')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const Vue = require('vue')
const vueRuntimeHelpers = require('vue-runtime-helpers')
const renderer = require('vue-server-renderer').createRenderer({
  template: '<!DOCTYPE html><html lang="en"><head><title>template</title></head><body><!--vue-ssr-outlet--></body></html>'
});

vueRuntimeHelpers.createInjector = vueRuntimeHelpers.createInjectorSSR;
global['vue'] = Vue
global['vue-runtime-helpers'] = vueRuntimeHelpers

dayjs.extend(customParseFormat)

module.exports = async (cms) => {
  cms.socket.on('connect', socket => {
    socket.on('processData', processDataFn);
  })

  async function processDataFn(reportName, input, callback) {
    try {
      input.from = new Date(input.from) // Socket.io send Dates as Strings
      input.to = new Date(input.to)

      const processData = jsonfn.clone(await cms.getModel('ProcessData').findOne({name: reportName}), true, true);
      let scope = {...input, ...processData};

      cms.models = cms.models || {}
      cms.models[processData.collections] = cms.getModel(processData.collections)
      global['cms'] = cms

      const ProcessData = require('../dist/ProcessData.vue')

      const component = new Vue({
        components: {ProcessData},
        render(h) {
          return h('ProcessData', {props: {model: scope}, on: {processFinish: (_scope) => callback(_scope)}})
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
