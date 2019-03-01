<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row="" style="padding: 0">
      <label class="v-label theme--light middle">{{field.label || field.key}}</label>
      <v-spacer></v-spacer>
      <v-slider v-model="model[field.key]" thumb-label="always" :min="field.min" :max="field.max"></v-slider>
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
  name: "RatingSelect",
  props: ['model', 'field', 'inArray', 'noFlex'],

  created() {},

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

  }
};
exports.default = _default;
</script> 
<style>
  .middle {
    padding-top: 25px !important;
  }
</style>
