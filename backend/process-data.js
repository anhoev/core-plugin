// require('./init-env')() // this function mutates vue-runtime-helpers to enable SSR & should be run only once

const jsonfn = require('json-fn')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
const { createApp, h } = require('vue')
const { renderToString } = require('@vue/server-renderer')
const _ = require('lodash')

dayjs.extend(customParseFormat)
global['dayjs'] = dayjs

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

      const ProcessData = require('../dist/ProcessData.vue.js')

      // TODO: Do we need to care about it?
      //  [Vue warn]: Failed to resolve component: g-btn
      //  [Vue warn]: Failed to resolve component: g-field
      //  [Vue warn]: Failed to resolve component: pivot-table2
      //  [Vue warn]: Failed to resolve component: grid-select
      //  [Vue warn]: Failed to resolve component: v-tag
      //  [Vue warn]: Failed to resolve component: g-tree-view-json
      const component = createApp(ProcessData, {
        model: processData,
        onlyData: true,
        ...input,
        onProcessFinish: (_scope) => {
          if (_.isEmpty(processData.output)) return callback(_scope);
          const scope = _.pick(_scope, [...processData.output, ...Object.keys(input)])
          return callback(scope);
        },
      })

      await renderToString(component)
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
