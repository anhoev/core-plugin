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
  injectService: ['AppContent:getListCollection'],
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

    select(item) {
      this.selectedDrawerItems = item;
      this.getListCollection(item.type, item.query);
    }

  },

  provide() {
    return {
      selectedDrawerItems: this.selectedDrawerItems
    };
  }

};
exports.default = _default;
</script> 
<style>

</style>
