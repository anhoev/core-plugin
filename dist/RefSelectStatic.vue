<template>
  <v-flex :class="flex" class="px-2">
    <v-combobox v-model="value" :items="options" :label="field.tableCell ? '': field.label || field.key" clearable="" @change="onChange" :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-combobox>
  </v-flex>
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
  props: ['model', 'field', 'inArray', 'noFlex'],

  created() {},

  data() {
    return {
      _value: null
    };
  },

  inject: {
    rootModel: {
      default: null
    },
    path: {
      default: null
    },
    noLayout: {
      default: null
    }
  },
  computed: {
    flex() {
      return this.noLayout ? 'xs-12' : this.field.flex;
    },

    options() {
      const list = _cms.default.Types[this.field.Type || this.field.ref].list;
      const labelProp = this.field.labelProp || _cms.default.Types[this.field.Type || this.field.ref].info.title;
      return list.map(item => ({
        text: item[labelProp],
        value: item
      }));
    },

    value: {
      get() {
        return {
          text: this.model[this.field.key] || ''
        };
      },

      set(v) {
        this.model[this.field.key] = v.text;
      }

    }
  },

  mounted() {
    this.value = {
      text: this.model[this.field.key]
    };
  },

  methods: {
    onChange(e) {
      if (this.field.onChange) this.field.onChange(e.value, this.rootModel, this.model);
    }

  }
};
exports.default = _default;
</script> 
<style>
  .middle {
    padding-top: 5px !important;
  }
</style>
