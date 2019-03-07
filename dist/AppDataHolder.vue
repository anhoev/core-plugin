<template>
    <div>
        <slot></slot>
    </div>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cms = _interopRequireDefault(require("cms"));

var _ = _interopRequireWildcard(require("lodash"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  data() {
    return {
      documents: [],
      totalDocument: 0,
      namespaces: ['Drawer', 'Pagination'],
      collection: ''
    };
  },

  name: 'DataHolder',
  domain: 'DataHolder',

  // inject: ['AppContent:getListCollection'],
  // props: ['namespaces'],
  provide() {
    let queryConditions = {};

    const countCollection = async function () {
      let arrNameSpace = _.cloneDeep(this.namespaces);

      if (!_.isEmpty(arrNameSpace) && !_.isEqual(arrNameSpace.sort(), Object.keys(queryConditions).sort())) {
        return;
      }

      let queryBuilder = _cms.default.getModel(this.collection);

      for (const key of Object.keys(queryConditions)) {
        const chainQuery = queryConditions[key];

        for (let {
          fn,
          agrs
        } of chainQuery) {
          if (['skip', 'limit'].includes(fn)) {
            break;
          }

          agrs = agrs || [];
          queryBuilder = queryBuilder[fn](...agrs);
        }
      }

      this.totalDocument = await queryBuilder.estimatedDocumentCount();
    }.bind(this);

    return {
      documents: this.documents,
      totalDocument: this.totalDocument,
      collection: this.collection,
      setCollection: _collection => {
        this.collection = _collection;
      },
      getCollection: () => {
        return this.collection;
      },

      clearQueryCondition() {
        queryConditions = {};
      },

      addQueryCondition(namespace, chainQuery) {
        queryConditions[namespace] = chainQuery;
      },

      execQuery: async () => {
        let arrNameSpace = _.cloneDeep(this.namespaces);

        if (!_.isEmpty(arrNameSpace) && !_.isEqual(arrNameSpace.sort(), Object.keys(queryConditions).sort())) {
          return;
        }

        let queryBuilder = _cms.default.getModel(this.collection);

        for (const key of Object.keys(queryConditions)) {
          const chainQuery = queryConditions[key];

          if (!chainQuery) {
            break;
          }

          for (let {
            fn,
            agrs
          } of chainQuery) {
            agrs = agrs || [];
            queryBuilder = queryBuilder[fn](...agrs);
          }
        }

        this.documents.splice(0, this.documents.length);
        let documents = await queryBuilder;
        this.documents.push(...documents);
        await countCollection();
      }
    };
  }

};
exports.default = _default;
</script> 
<style scoped>

</style>
