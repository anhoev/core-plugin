<template>
  <g-col :class="flex" class="px-2">
    <g-row style="padding-top: 20px">
      <label class="v-label theme--light middle">{{field.label || field.key}}</label>
      <g-spacer/>
      <span class="grey--text caption mr-2 middle" v-if="model[field.key]">
				({{field.hintPrepend}}{{ model[field.key] }})
			</span>
      <v-rating v-model="model[field.key]" :length="field.length"
                dense hover
                empty-icon="fiber_manual_record"
                full-icon="fiber_manual_record"
                background-color="grey lighten-1"/>
    </g-row>
  </g-col>
</template>

<script>
  import cms from 'cms';

  export default {
    name: 'RatingSelect',
    props: ['model', 'field', 'inArray', 'noLayout', 'rootModel', 'path'],
    created() {
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
