<template>
    <div style="display: flex; align-items: center;">
        <v-btn @click="openSettings" small flat color="white">
            Settings
        </v-btn>
        <app-form-dialog
                :dialog.sync="configDialog" :toggle-dialog="toggleDialog"
                :config-model="dialogConfigModel" :tabs="configTabs" :fields="configField"
                :type="type"
        ></app-form-dialog>
    </div>
</template>

<script>
  import FormDialog from './AppFormDialog';

  export default {
    name: 'SettingButton',
    components: { FormDialog },
    data() {
      return {
        configDialog: false,
        dialogConfigModel: {},
        configTabs: {},
        mode: 'form',
        selectedDrawerItems: {},
        type: ''
      };
    },
    injectService: ['AppDrawer:selectedDrawerItems'],
    computed: {
      configField() {
        return cms.getForm('Config');
      }
    },
    methods: {
      async openSettings() {
        const Model = cms.models.Config;
        const config = await Model.findOne({ type: this.selectedDrawerItems.type });
        this.configTabs = cms.Types.Config.tabs;
        this.type = 'Config';
        if (!config) {
          this.dialogConfigModel = await Model.new({ type: this.selectedDrawerItems.type });
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
</script>

<style scoped>

</style>
