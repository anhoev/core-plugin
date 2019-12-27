const jsonfn = require('json-fn');
const _ = require('lodash');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

module.exports = async (cms) => {

  cms.io.on('processData', processDataFn);

  async function processDataFn(reportName, input, callback) {
    try {
      const processData = jsonfn.clone(await cms.getModel('ProcessData').findOne({name: reportName}), true, true);
      const processDataTargetModel = cms.getModel(processData.collections)
      const steps = processData.items;
      let scope = {...input};
      let result = {};

      await process();
      if (!_.isEmpty(processData.output)) {
        processData.output.forEach(key => result[key] = scope[key]);
      } else {
        result = scope;
      }
      callback(result)

      async function process() {
        for (const step of steps) {
          if (step.choice === 'step' && step.type === 'query') {
            const queries = step.items;
            const queryConditions = [];
            for (const query of queries) {
              let val = query.valueType === 'variable' ? scope[query.value] : query.value;
              queryConditions.push({[query.path]: {[query.comparator]: val}});
            }
            scope[step.output] = await processDataTargetModel.find({$and: queryConditions})
          } else if (step.choice === 'pivottable') {
            //todo: pivottable code
            let items = scope[step.input];
            const {jsonData} = await renderPivotTable(step, items);
            scope[step.output] = jsonData
          } else if (step.choice === 'convert') {
            let items = scope[step.input];
            const convertFn = step.fn.fn;

            if (convertFn) scope[step.output] = convertFn(items);
          } else if (step.choice === 'filter') {
            let items = scope[step.input];
            const convertFn = step.fn.fn;


            if (convertFn) scope[step.output] = items.filter(convertFn);
          } else if (step.choice === 'mergePivot') {
            //todo: getAllProps
            const props = _.union(..._(step.input).map(i => scope[i.name]).map(obj => Object.keys(obj)).value());
            const inputArr = _(step.input).map(i => ({key: i.prop, value: scope[i.name]})).cloneDeep();
            const result = {};
            for (const prop of props) {
              const val = {};
              for (const {key, value: inputObj} of inputArr) {
                if (!inputObj[prop]) continue;
                if (key) {
                  val[key] = inputObj[prop];
                } else {
                  _.assign(val, inputObj[prop]);
                }
              }
              result[prop] = val;
            }
            scope[step.output] = result
          }
        }
      }

      async function renderPivotTable(pivot, items) {
        const result = {data: items};

        const convertReducer = r => {
          if (r.fn) return r.fn;
          if (r.choice === 'sum') {
            return function (sum, item) {
              return sum + item[r.path];
            }
          }
        }

        result.reducer = convertReducer(pivot.reducers[0]);
        result.reducers = pivot.reducers.map(r => {
          return {
            name: r.label || r.path,
            fn: convertReducer(r)
          }
        });
        result.reducerType = pivot.reducers[0].resultType;

        const convert = r => {
          if (r.choice === 'field') {
            return {label: r.label, getter: i => i[r.field]};
          } else {
            return {label: r.label, getter: r.fn}
          }
        }

        result.rowFields = pivot.rows.map(convert);
        result.colFields = pivot.columns.map(convert);
        if (pivot.filter) result.filter = pivot.filter.map(convert);

        let fields = result.colFields.concat(result.rowFields);
        if (result.filter) fields = result.filter.concat(fields);

        let jsonData = _(items).groupBy(item => {
          const arr = [];
          for (const field of fields) {
            arr.push(field.getter(item));
          }
          return arr.join('.');
        }).mapValues(items => {
          const _result = result.reducers.reduce((obj, reducer) => _.assign(obj, {[reducer.name]: _.reduce(items, reducer.fn, 0)}), {});
          if (result.reducers.length === 1) return _result[result.reducers[0].name];
          return _result;
        }).thru(groups => {
          const res = {};
          for (const k in groups) {
            if (result.reducerType === 'array' && groups[k].length === 0) continue;
            _.setWith(res, k, groups[k], Object);
          }
          return res;
        }).value();
        if (fields.length === 0) jsonData = jsonData[''];
        return {renderData: result, jsonData};
      }
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
