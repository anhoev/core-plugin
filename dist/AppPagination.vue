<template>
    <div class="v-datatable__actions">
        <div class="v-datatable__actions__select">Rows per page:
            <v-select hide-details="" :menu-props="{auto: true, minWidth: '75px'}" :items="computedRowsPerPageItems" :value="limit" @input="changeLimitRow">
        </v-select></div>
        <div class="v-datatable__actions__range-controls">
            <div class="v-datatable__actions__pagination">{{documentFrom}}-{{documentTo}} of {{totalDocument}}</div>
            <v-btn icon="" flat="" :disabled="disablePre" @click="prevPage">
                <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-btn icon="" flat="" :disabled="disableNext" @click="nextPage">
                <v-icon>chevron_right</v-icon>
            </v-btn>
        </div>
    </div>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: 'Paginate',
  props: {
    configModel: {}
  },
  data: () => ({
    items: [],
    limit: 10,
    currentPage: 1,
    computedRowsPerPageItems: [10, 15, 20, 25, 50]
  }),
  domain: 'AppPagination',

  provide() {
    return {
      resetPageToOne: this.resetPageToOne.bind(this)
    };
  },

  computed: {
    documentFrom() {
      return (this.currentPage - 1) * this.limit + 1;
    },

    documentTo() {
      let toDocument = this.currentPage * this.limit;

      if (toDocument > this.totalDocument) {
        return this.totalDocument;
      }

      return toDocument;
    },

    disablePre() {
      return this.limit * (this.currentPage - 1) == 0;
    },

    disableNext() {
      return this.limit * this.currentPage >= this.totalDocument;
    }

  },
  injectService: ['DataHolder:addQueryCondition', 'DataHolder:execQuery', 'DataHolder:totalDocument'],
  methods: {
    getFieldForm(filter) {
      return cms.getForm(this.info.type).find(item => item.key === filter);
    },

    execQueryByPage: function () {
      let skipDocument = (this.currentPage - 1) * this.limit;
      this.addQueryCondition('Pagination', [{
        fn: 'skip',
        agrs: [skipDocument]
      }, {
        fn: 'limit',
        agrs: [this.limit]
      }]);
      this.execQuery();
    },

    resetPageToOne() {
      if (this.currentPage === 1) {
        return;
      }

      this.currentPage = 1;
    },

    nextPage() {
      this.currentPage = this.currentPage + 1;
      this.execQueryByPage();
    },

    prevPage() {
      this.currentPage = this.currentPage - 1;
      this.execQueryByPage();
    },

    changeLimitRow(value) {
      this.limit = value;
      this.execQueryByPage();
    }

  },

  mounted() {
    this.limit = this.configModel && this.configModel.limit ? this.configModel.limit : 10;
    this.execQueryByPage();
  }

};
exports.default = _default;
</script> 
<style scoped>

</style>
