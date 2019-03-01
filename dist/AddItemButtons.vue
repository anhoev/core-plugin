<template>
    <div style="display: flex; align-items: center;">
        <v-btn @click="openDialog" small="" flat="" color="white">
            Add Item
        </v-btn>
        <app-form-dialog :dialog.sync="addDialog" :toggle-dialog="toggleDialog" :config-model="createModel" :fields="getFields" :type="type"></app-form-dialog>
    </div>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cms = _interopRequireDefault(require("cms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import FormDialog from './AppFormDialog';
var _default = {
  name: 'AddItemButton',

  data() {
    return {
      addDialog: false,
      createModel: {},
      configTabs: {},
      mode: 'form',
      selectedDrawerItems: {}
    };
  },

  injectService: ['AppDrawer:selectedDrawerItems'],
  computed: {
    getFields() {
      return _cms.default.Types[this.selectedDrawerItems.type] && _cms.default.Types[this.selectedDrawerItems.type].form;
    },

    type() {
      return this.selectedDrawerItems.type;
    }

  },
  methods: {
    async openDialog() {
      const type = this.selectedDrawerItems.type;

      if (type) {
        const Model = _cms.default.getModel(type);

        this.createModel = await Model.new();
        this.addDialog = true;
      } //
      // const Model = cms.models.Config;
      // const config = await Model.findOne({ type: this.provideProps.selectedDrawerItems });
      // this.configTabs = cms.Types.Config.tabs;
      // this.type = 'Config';
      // if (!config) {
      //   this.dialogConfigModel = await Model.new({ type: this.provideProps.selectedDrawerItems });
      //   this.configDialog = true;
      // } else {
      //   this.dialogConfigModel = config;
      // }

    },

    toggleDialog(value) {
      this.addDialog = value;
    }

  }
};
exports.default = _default;
</script> 
<style scoped>

</style>
