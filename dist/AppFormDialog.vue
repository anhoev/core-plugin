<template>
    <div>
        <v-dialog width="900px" v-model="dialogModel">
            <v-card v-if="dialogModel">
                <v-card-title v-show="!tabs"><span class="headline">{{name}}</span></v-card-title>
                <v-card-text style="min-height: 500px" v-if="mode === 'form'">
                    <g-field :model="configModel" :fields="fields" :tabs="tabs"></g-field>
                </v-card-text>
                <v-card-text style="min-height: 500px" v-else-if="mode === 'preview'">
                    <slot name="renderPreview"></slot>
                </v-card-text>
                <v-card-text style="min-height: 500px" v-else-if="mode === 'json'">
                    <slot name="renderJsonView"></slot>
                </v-card-text>
                <slot name="renderCardAction"></slot>
                <slot></slot>

                <v-btn color="green darken-1" flat="flat" @click="save()">
                    Save
                </v-btn>
            </v-card>
        </v-dialog>
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

var _default = {
  name: 'AppFormDialog',
  props: {
    dialog: Boolean,
    fields: {},
    tabs: {},
    configModel: {},
    name: String,
    type: String,
    toggleDialog: Function
  },

  data() {
    return {
      mode: 'form',
      previewModel: {},
      load: false
    };
  },

  computed: {
    configField() {
      return _cms.default.getForm('Config');
    },

    renderComponent() {
      const config = _cms.default.getList('Config').find(c => c.type === this.type);

      if (config) {
        return config.renderComponent;
      }
    },

    renderFormDialog() {
      return this.configModel && this.configModel.formDialog;
    },

    renderFullscreenFormDialog() {
      return this.renderFormDialog && this.renderFormDialog.type === 'fullscreen';
    },

    dialogModel: {
      set(value) {
        if (typeof this.toggleDialog === 'function') {
          this.toggleDialog(value);
        } // this.$emit('update:dialog', value)

      },

      get() {
        return this.dialog;
      }

    }
  },
  methods: {
    async save() {
      const Model = _cms.default.getModel(this.type);

      await Model.findOneAndUpdate({
        _id: this.configModel._id
      }, this.configModel, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: false
      });
      this.toggleDialog(false);
      this.$emit('save');
    }

  }
};
exports.default = _default;
</script> 
<style>
</style>
