<template>
    <vuetify-tree-view :items="drawerItems" item-text="text" @select="onSelect">
    </vuetify-tree-view>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cms = _interopRequireDefault(require("cms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'Drawer',

  data() {
    return {
      drawerItems: [],
      list: [],
      selectedDrawerItems: {}
    };
  },

  mounted() {
    this.getListDrawerItem();
  },

  domain: 'AppDrawer',
  injectService: ['DataHolder:execQuery', 'DataHolder:addQueryCondition', 'DataHolder:setCollection', 'DataHolder:clearQueryCondition', 'DataHolder/AppPagination:resetPageToOne'],
  methods: {
    getListDrawerItem() {
      this.drawerItems = _cms.default.getAdminList();
    },

    itemText(a) {
      return a;
    },

    onSelect(item) {
      this.select(item);
    },

    async select(item) {
      this.setCollection(item.type);
      this.clearQueryCondition();
      console.log(this);
      this.resetPageToOne();
      this.addQueryCondition('Drawer', [{
        fn: 'find',
        agrs: [item.query]
      }]);
      this.addQueryCondition('Pagination', [{
        fn: 'limit',
        agrs: [10]
      }]);
      this.$emit('fetchConfig', item.type);
      await this.execQuery(); // this.getListCollection(item.type, item.query);
    }

  },

  provide() {
    return {
      selectedDrawerItems: this.selectedDrawerItems,
      columns: this.selectedDrawerItems.columns
    };
  }

};
exports.default = _default;
</script> 
<style>

</style>
