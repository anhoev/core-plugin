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
    injectService: ['AppContent:getListCollection'],
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
</script>

<style>

</style>
