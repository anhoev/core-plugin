<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
  import cms from 'cms';
  import * as _ from 'lodash';

  export default {
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
        let queryBuilder = cms.getModel(this.collection);

        debugger;

        for (const key of Object.keys(queryConditions)) {
          const chainQuery = queryConditions[key];
          for (let { fn, agrs } of chainQuery) {
            if (['skip', 'limit'].includes(fn)) {
              break;
            }
            agrs = agrs || [];
            queryBuilder = queryBuilder[fn](...agrs);
          }
        }
        this.totalDocument = await queryBuilder.count();
      }.bind(this);

      return {
        documents: this.documents,
        totalDocument: this.totalDocument,
        collection: this.collection,
        setCollection: (_collection) => {
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

          let queryBuilder = cms.getModel(this.collection);
          for (const key of Object.keys(queryConditions)) {
            const chainQuery = queryConditions[key];
            if (!chainQuery) {
              break;
            }
            for (let { fn, agrs } of chainQuery) {
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
</script>

<style scoped>

</style>
