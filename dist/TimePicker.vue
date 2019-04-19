<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row="">
      <v-menu v-model="menu" z-index="10000" :close-on-content-click="false">
        <v-text-field slot="activator" v-model="model[field.key]" :label="field.label || field.key" prepend-icon="access_time" readonly=""></v-text-field>
        <v-time-picker format="24hr" v-if="menu" v-model="model[field.key]" @click:minute="closeMenu()"></v-time-picker>
      </v-menu>
    </v-layout>
  </v-flex>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: 'TimePicker',
  props: ['model', 'field', 'inArray', 'noFlex'],

  data() {
    return {
      menu: false
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
    }

  },
  methods: {
    closeMenu() {
      this.menu = false;
    }

  }
};
exports.default = _default;
</script> 
<style>
</style>
