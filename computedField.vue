<template>
  <flex :class="flex">
    <v-subheader>{{field.label || field.key}}:  {{result}}</v-subheader>
  </flex>
</template>

<script>
  import jsonFn from 'json-fn';
  export default {
    name: '',
    props: ['model', 'field'],
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      }
    },
    data() {
      return {
        result: null
      }
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
    },
    watch: {
      rootModel: {
        handler: function () {
          this.compute();
        },
        deep: true
      }
    },
    methods: {
      compute() {
        const fn = jsonFn.clone(this.field.fn, true, true).bind(this.rootModel);
        this.result = fn();
      }
    }

  }
</script>

<style scoped>

</style>