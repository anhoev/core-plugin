<template>
  <v-flex :class="flex" class="px-2">
    <v-combobox v-model="value" :items="options" :label="field.tableCell ? '': field.label || field.key" clearable
                    deletable-chips chips small-chips
                    @change="onChange" multiple hide-selected
                    :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-combobox>
  </v-flex>
</template>

<script>
  import cms from 'cms';

  export default {
    props: ['model', 'field', 'inArray', 'noFlex'],
    created() {
    },
    data() {
      return {
        _value: null
      }
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
      noLayout: {default: null}
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      options() {
        const list = cms.Types[this.field.Type || this.field.ref].list;
        const labelProp = this.field.labelProp || cms.Types[this.field.Type || this.field.ref].info.title;
        return list.map(item => ({text: item[labelProp], value: item}));
      },
      value: {
        get() {
          if (!this.model[this.field.key]) return [];
          return this.model[this.field.key].map(i => ({text: i}));
        },
        set(v) {
          if (!this.model[this.field.key]) {
            this.$set(this.model, this.field.key, []);
          }
          this.model[this.field.key].length = 0;
          if (v && v.map) this.model[this.field.key].push(...v.map(i => i.text));
        }
      }
    },
    methods: {
      onChange(items) {
        if (this.field.onChange) this.field.onChange(items.map(i => i.value), this.rootModel, this.model);
      }
    }
  }
</script>

<style>
  .middle {
    padding-top: 5px !important;
  }
</style>
