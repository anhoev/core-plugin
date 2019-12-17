<template>
  <g-col :class="flex" class="px-2">
    <g-row style="padding: 0">
      <label class="v-label theme--light middle">{{field.label || field.key}}</label>
      <g-spacer/>
      <g-slider
          v-model="model[field.key]"
          thumb-label="always"
          :min="field.min"
          :max="field.max"/>
    </g-row>
  </g-col>
</template>

<script>
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
    padding-top: 25px !important;
  }
</style>
