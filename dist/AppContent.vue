<template>
    <v-flex>
        <table class="v-datatable v-table theme--light">
            <thead>
            <tr>
                <th v-for="column in getColumn">{{column.label}}</th>
                <th>&nbsp;&nbsp;&nbsp;X</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-md-left" v-for="(document, index) in documents" :key="index">
                <td v-for="column in getColumn" class="input-group-sm">
                    {{document[column.key]}}
                </td>
                <td>
                    <v-menu bottom="" open-on-hover="" left="">
                        <v-icon slot="activator">menu</v-icon>
                        <div class="v-btn-group">

                            <v-btn flat="" @click="copyItem(document)">
                                <v-icon small="">file_copy</v-icon>
                            </v-btn>
                            <v-btn flat="" @click="removeItem(document)">
                                <v-icon small="">delete_outline</v-icon>
                            </v-btn>
                            <v-btn flat="" @click="openEditDialog(document)">
                                <v-icon small="">edit</v-icon>
                            </v-btn>
                        </div>
                    </v-menu>
                </td>
            </tr>
            <!--<table-editor-row-->
            <!--v-for="(document, index) in documents"-->
            <!--:key="index"-->
            <!--:item="document"-->
            <!--:columns="columns"-->
            <!--:collection="collection"-->
            <!--&gt;-->
            <!--<template slot="menu">-->
            <!--<slot name="menu" :document="document" :collection="collection" :openDialog="openDialog"-->
            <!--:openDialogExport="openDialogExport" />-->
            <!--</template>-->
            <!--</table-editor-row>-->
            </tbody>
        </table>
        <app-form-dialog :config-model="editingItem" :dialog="dialog" :fields="getFields" :tabs="getTabs" :type="collection" :toggle-dialog="toggleDialog" @save="refresh">
        </app-form-dialog>
    </v-flex>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AppDataHolder = _interopRequireDefault(require("./AppDataHolder"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'AppContent',
  props: ['model'],

  data() {
    return {
      editingItem: null,
      dialog: false,
      documents: [],
      selectedDrawerItems: {},
      collection: ''
    };
  },

  domain: 'AppContent',
  injectService: ['AppDrawer:selectedDrawerItems', 'DataHolder:documents', 'DataHolder:collection'],
  computed: {
    getFields() {
      const type = cms.Types[this.collection];
      return type && type.form;
    },

    getTabs() {
      const type = cms.Types[this.collection];
      return type && type.tabs;
    },

    // getCollection() {
    //   return this.selectedDrawerItems.type || (this.model && this.model.collection);
    // },
    getColumn() {
      return cms.getColumns(this.collection);
    }

  },

  created() {
    console.log('created content');
  },

  mounted() {// if (this.model) {
    //   // this.getListCollection(this.model.collection);
    // }
  },

  methods: {
    openEditDialog(document) {
      this.editingItem = document;
      this.$nextTick(() => {
        return this.dialog = true;
      });
    },

    toggleDialog(value) {
      this.dialog = value;
    },

    async copyItem(document) {
      const Model = cms.getModel(this.collection);

      const _item = _.cloneDeep(document);

      delete _item._id;
      delete _item.id;
      await Model.create(_item);
      this.refresh();
    },

    async removeItem(document) {
      const Model = cms.getModel(this.collection);
      await Model.remove({
        _id: document._id
      });
      this.refresh();
    },

    // getListCollection(collection, query = {}) {
    //   cms.getModel(collection).find(query)
    //     .then(res => {
    //       this.collectionItems = res;
    //     });
    // },
    refresh() {// this.getListCollection(this.getCollection, this.selectedDrawerItems.query);
    }

  },

  beforeDestroy() {
    console.log('destroy content');
  },

  provide() {
    return {// getListCollection: this.getListCollection.bind(this)
    };
  }

};
exports.default = _default;
</script> 
<style scoped>.v-btn-group {
  border-radius: 2px;
  display: inline-flex; }
  .theme--dark .v-btn-group {
    background: #424242; }
  .theme--light .v-btn-group {
    background: #fff; }
  .v-btn-group .v-btn {
    border-radius: 0;
    justify-content: center;
    margin: 0;
    min-width: auto;
    padding: 0 8px;
    width: auto; }
    .v-btn-group .v-btn:not(:last-child) {
      border-right: 1px solid transparent; }
    .v-btn-group .v-btn:first-child {
      border-radius: 2px 0 0 2px; }
    .v-btn-group .v-btn:last-child {
      border-radius: 0 2px 2px 0; }
</style>
