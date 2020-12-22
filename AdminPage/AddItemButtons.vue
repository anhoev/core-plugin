<template>
    <div style="display: flex; align-items: center;">
        <v-btn @click="openDialog" small flat color="white">
            Add Item
        </v-btn>
        <app-form-dialog
                v-model:dialog="addDialog"
                :toggle-dialog="toggleDialog"
                :config-model="createModel"
                :fields="getFields" :type="type"
        ></app-form-dialog>
    </div>
</template>

<script>
  // import FormDialog from './AppFormDialog';
  import cms from 'cms';

  export default {
    name: 'AddItemButton',
    data() {
      return {
        addDialog: false,
        createModel: {},
        configTabs: {},
        mode: 'form',
        collection: ''
      };
    },
    injectService: ['DataHolder:collection'],
    computed: {
      getFields() {
        return cms.Types[this.collection] && cms.Types[this.collection].form;
      },
      type() {
        return this.collection;
      }
    },
    methods: {
      async openDialog() {
        const type = this.collection;
        if (type) {
          const Model = cms.getModel(type);
          this.createModel = await Model.new();
          this.addDialog = true;
        }
        //
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
</script>

<style scoped>

</style>
