<template>
	<template v-if="!onlyData">
		<g-btn @click="process" small depressed>process</g-btn>
		<g-field :fields="inputFormFields" :model="scope"/>
		<template v-for="({type, name, data, options, filter, model}, index) in renderData">
			<h6 style="margin-bottom: 10px">{{type}} : {{name}}</h6>

			<pivot-table2 v-bind="data" v-if="type === 'pivottable'"/>

			<template v-if="type === 'pivottableWithFilter'">
				<grid-select :items="options" v-model="renderData[index].model" select-first></grid-select>
				<v-tag mb-2/>
				<pivot-table2 :row-fields="data.rowFields"
											:col-fields="data.colFields"
											:reducers="data.reducers"
											:data="filterData(data.data, filter, renderData[index].model)"/>
			</template>

			<template v-if="type === 'json'">
				<g-tree-view-json :data="data" :expand-level="1" show-length/>
			</template>

			<hr>
		</template>
	</template>
	<template v-else>
		<g-tree-view-json :data="scope" :expand-level="0" show-length/>
		<slot v-bind="scope"></slot>
	</template>
</template>

<script>
  import * as jsonFn from 'json-fn';
  const cms = global['cms'];
  import _ from 'lodash';

  export default {
    name: 'ProcessData',
    props: {
      model: {
        type: Object,
        default: () => ({})
      },
      onlyData: Boolean
    },
    data() {
      return {
        items: [],
        reducers: [],
        rows: [{
          getter: item => item.user && item.user[0].name,
          label: 'User'
        }],
        cols: [],
        reducer: null,
        scope: {},
        renderData: []
      }
    },
    computed: {
      inputFormFields() {
        let inputForm = this.model.inputForm;
        if (typeof inputForm === 'string') {
          inputForm = _.find(cms.getList('BuildForm'), { _id: this.model.inputForm });
        }
        return inputForm.fields;
      },
      Model() {
        return cms.models[this.model.collections];
      }
    },
    methods: {
      filterData(items, filter, val) {
        return items.filter(i => filter.fn(i) === val);
      },
      async process() {
        this.renderData = [];
        const steps = this.model.items;
        for (const step of steps) {
          if (step.choice === 'step' && step.type === 'query') {
            const queries = step.items;
            const queryConditions = [];
            for (const query of queries) {
              let val = query.valueType === 'variable' ? this.scope[query.value] : query.value;
              queryConditions.push({ [query.path]: { [query.comparator]: val } });
            }
            const result = await this.Model.find({ $and: queryConditions });
            this.scope[step.output] = result
            //this.scope[step.output] = result;
          } else if (step.choice === 'pivottable') {
            //todo: pivottable code
            let items = this.scope[step.input];
            const { renderData, jsonData } = await this.renderPivotTable(step, items);
            this.scope[step.output] = jsonData
            //this.scope[renderData] = jsonData;
            //console.log(step.output, jsonFn.clone(jsonData));
            if (step.view === 'json') {
              this.renderData.push({ type: 'json', data: jsonData, name: step.name || step.output });
            } else if (_.isEmpty(step.filter)) {
              this.renderData.push({ type: 'pivottable', data: renderData, name: step.name || step.output });
            } else {
              const filter = step.filter[0];
              this.renderData.push({
                type: 'pivottableWithFilter',
                data: renderData,
                filter,
                options: Object.keys(jsonData),
                name: step.name || step.output,
                model: null
              });
            }
          } else if (step.choice === 'convert') {
            let items = this.scope[step.input];
            const convertFn = step.fn.fn;
            if (convertFn) {
              this.scope[step.output] = convertFn(items)
              //this.scope[step.output] = convertFn(items);
            }
            //console.log(step.output, jsonFn.clone(this.scope[step.output]));
          } else if (step.choice === 'filter') {
            let items = this.scope[step.input];
            const convertFn = step.fn.fn;
            if (convertFn) {
              this.scope[step.output] = items.filter(convertFn)
              //this.scope[step.output] = items.filter(convertFn);
            }
            //console.log(step.output, jsonFn.clone(this.scope[step.output]));
          } else if (step.choice === 'mergePivot') {
            //todo: getAllProps
            const props = _.union(..._(step.input).map(i => this.scope[i.name]).map(obj => Object.keys(obj)).value());
            const inputArr = _(step.input).map(i => ({ key: i.prop, value: this.scope[i.name] })).cloneDeep();
            const result = {}
            for (const prop of props) {
              const val = {};
              for (const { key, value: inputObj } of inputArr) {
                if (!inputObj[prop]) continue;
                if (key) {
                  val[key] = inputObj[prop];
                } else {
                  _.assign(val, inputObj[prop]);
                }
              }
              result[prop] = val;
            }
            this.renderData.push({ type: 'json', data: result, name: step.output });
            this.scope[step.output] = result
            //console.log(step.output, jsonFn.clone(this.scope[step.output]));
          }
        }
        this.$emit('processFinish', this.scope);
      },
      async renderPivotTable(pivot, items) {
        const result = { data: items };
        this.items = items;

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
            fn: convertReducer(r),
            initValue: r.initValue,
            format: r.format
          }
        });

        result.reducerType = pivot.reducers[0].resultType;
        const convert = r => {
          if (r.choice === 'field') {
            return { label: r.label, getter: i => i[r.field] };
          } else {
            return { label: r.label, getter: r.fn }
          }
        }

        result.rowFields = pivot.rows.map(convert);
        result.colFields = pivot.columns.map(convert);
        if (pivot.filter) {
          result.filter = pivot.filter.map(convert);
        }

        let fields = result.colFields.concat(result.rowFields);
        if (result.filter) fields = result.filter.concat(fields);

        let jsonData = _(items).groupBy(item => {
          const arr = [];
          for (const field of fields) {
            arr.push(field.getter(item));
          }
          return arr.join(',');
        }).mapValues(items => {
          const _result = result.reducers.reduce((obj, reducer) => {
            let reduceResult = _.reduce(items, reducer.fn, reducer.initValue ? eval(reducer.initValue) : 0);
            if (reducer.format) reduceResult = reducer.format(reduceResult)
            return _.assign(obj, { [reducer.name]: reduceResult});
          }, {});
          if (result.reducers.length === 1) return _result[result.reducers[0].name];
          return _result;
        }).thru(groups => {
          const res = {};
          for (const k in groups) {
            if (result.reducerType === 'array' && groups[k].length === 0) continue;
            _.setWith(res, k.split(','), groups[k], Object);
          }
          return res;
        }).value();
        if (fields.length === 0) jsonData = jsonData[''];

        return { renderData: result, jsonData };
      }
    },
    created() {
      if (!this.onlyData) {
        this.scope = _.assign(this.scope, this.model.initProps)
      } else {
        let fields = this.model.inputForm.fields.map(f => f.key);
        this.scope = _.assign(this.scope, _.pick(this.$attrs, fields))
      }
      //this.renderPivotTable();
      this.process();
    }
  }
</script>

<style scoped>

</style>
