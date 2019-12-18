<template>
  <g-col :class="flex">
    <g-subheader>{{field.label || field.key}}: {{result}}</g-subheader>
  </g-col>
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
        deep: true,
        immediate: true
      }
    },
    methods: {
      compute() {
        const fn = jsonFn.clone(this.field.fn, true, true);
        this.result = fn.bind(this.rootModel)({model: this.model, rootModel: this.rootModel});
      }
    }

  }
</script>

<style scoped>

</style>
