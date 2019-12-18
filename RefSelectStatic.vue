<template>
  <g-col :class="flex" class="px-2">
    <g-combobox v-model="model[field.key]" :items="options" :label="field.tableCell ? '': field.label || field.key" clearable
                @change="onChange"
                :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <template #append-outer v-if="inArray">
        <g-icon @click.stop="$emit('remove-field')">delete_outline</g-icon>
      </template>
    </g-combobox>
  </g-col>
</template>

<script>
  import cms from 'cms';

  export default {
    props: ['model', 'field', 'inArray', 'noFlex', 'path', 'noLayout'],
    created() {
    },
    data() {
      return {
        _value: null
      }
    },
    inject: {
      rootModel: {default: null},
      //path: {default: null},
      //noLayout: {default: null}
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      options() {
        const list = cms.Types[this.field.Type || this.field.ref].list;
        const labelProp = this.field.labelProp || cms.Types[this.field.Type || this.field.ref].info.title;
        return list.map(item => item[labelProp]);
      }
    },
    methods: {
      onChange(e) {
        if (this.field.onChange) this.field.onChange(e.value, this.rootModel, this.model);
      }
    }
  }
</script>

<style>
  .middle {
    padding-top: 5px !important;
  }
</style>
