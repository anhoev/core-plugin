<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row style="padding-top: 20px">
      <label class="v-label theme--light middle">{{field.label || field.key}}</label>
      <v-spacer></v-spacer>
      <span class="grey--text caption mr-2 middle" v-if="model[field.key]">
          ({{field.hintPrepend}}{{ model[field.key] }})
      </span>
      <v-rating v-model="model[field.key]" :length="field.length"
          dense hover
          empty-icon="fiber_manual_record"
          full-icon="fiber_manual_record"
          background-color="grey lighten-1"
      ></v-rating>
    </v-layout>
  </v-flex>
</template>

<script>
  import cms from 'cms';

  export default {
    name: "RatingSelect",
    props: ['model', 'field', 'inArray', 'noFlex'],
    created() {
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
      noLayout: {default: null}
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      }
    }
  }
</script>

<style>
  .middle {
    padding-top: 5px !important;
  }
</style>
