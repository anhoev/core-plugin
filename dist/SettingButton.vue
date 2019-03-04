<template>
    <div style="display: flex; align-items: center;">
        <v-btn @click="openSettings" small="" flat="" color="white">
            Settings
        </v-btn>
        <app-form-dialog :dialog.sync="configDialog" :toggle-dialog="toggleDialog" :config-model="dialogConfigModel" :tabs="configTabs" :fields="configField" :type="type"></app-form-dialog>
    </div>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AppFormDialog = _interopRequireDefault(require("./AppFormDialog"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'SettingButton',
  components: {
    FormDialog: _AppFormDialog.default
  },

  data() {
    return {
      configDialog: false,
      dialogConfigModel: {},
      configTabs: {},
      mode: 'form',
      selectedDrawerItems: {},
      type: '',
      collection: ''
    };
  },

  injectService: ['DataHolder:collection'],
  computed: {
    configField() {
      return cms.getForm('Config');
    }

  },
  methods: {
    async openSettings() {
      const Model = cms.models.Config;
      const config = await Model.findOne({
        type: this.collection
      });
      this.configTabs = cms.Types.Config.tabs;
      this.type = 'Config';

      if (!config) {
        this.dialogConfigModel = await Model.new({
          type: this.collection
        });
        this.configDialog = true;
      } else {
        this.dialogConfigModel = config;
        this.configDialog = true;
      }
    },

    toggleDialog(value) {
      this.configDialog = value;
    }

  }
};
exports.default = _default;
</script> 
<style scoped>

</style>
