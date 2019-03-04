<template>
    <vuetify-tree-view :items="drawerItems" item-text="text"
                       @select="onSelect"
    >
    </vuetify-tree-view>
</template>

<script>
  import cms from 'cms';

  export default {
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
    injectService: ['DataHolder:execQuery', 'DataHolder:addQueryCondition', 'DataHolder:setCollection', 'DataHolder:clearQueryCondition'],
    methods: {
      getListDrawerItem() {
        this.drawerItems = cms.getAdminList();
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
        this.addQueryCondition('Drawer', [{ fn: 'find', agrs: [item.query] }]);
        this.addQueryCondition('Pagination', [{ fn: 'limit', agrs: [10] }]);
        this.$emit('fetchConfig', item.type);
        await this.execQuery();
        // this.getListCollection(item.type, item.query);
      }
    },
    provide() {
      return {
        selectedDrawerItems: this.selectedDrawerItems,
        columns: this.selectedDrawerItems.columns
      };
    }
  };
</script>

<style>

</style>
