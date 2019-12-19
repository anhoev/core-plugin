<template>
  <g-row class="flex" class="px-2">
    <!--TODO dynamic class when field shown in table-->
    <g-time-picker-input v-model="model[field.key]"
                         :show-icon="field.showIcon"
                         :clearable="field.clearable"
                         use24-hours
    >
    </g-time-picker-input>
  </g-row>
</template>

<script>
  export default {
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
      },
      clearTime() {
        this.model[this.field.key] = null;
      }
    }
  };
</script>

<style>
</style>
