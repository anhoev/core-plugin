<template>
  <g-col :class="flex" class="px-2">
    <g-text-field v-model="codeModel">
      <g-icon slot="append-inner" v-if="inArray" @click.stop="removeField">delete_outline</g-icon>
    </g-text-field>
  </g-col>
</template>

<script>
  import cms from 'cms';

  export default {
    name: 'I18nInput',
    props: ['model', 'field', 'inArray', 'noLayout', 'rootModel', 'path'],
    created() {
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      codeModel: {
        get() {
          return this.model[this.field.key]._metadata_.text;
        },
        set(value) {
          this.model[this.field.key]._code_ = `
          module.exports = function() {
            return $t('${value}')
          }
          `;
          this.model[this.field.key]._metadata_ = {
            text: value
          }
        }
      },
    },
    created() {
      if (!this.model[this.field.key]) {
        this.model[this.field.key] = {
          _code_ : `module.exports = () => null`,
          _code_type_: 'commonJs',
          _metadata_: {}
        }
      }
    },
    methods: {
      removeField() {
        //this.model.splice(this.field.key, 1);
        this.$emit('remove-field');
      }
    }
  }
</script>

<style>
  .middle {
    padding-top: 5px !important;
  }
</style>
