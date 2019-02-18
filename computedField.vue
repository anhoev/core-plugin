<template>
  <div>
    <v-btn small depressed @click="compute">compute</v-btn>
    {{result}}
  </div>
</template>

<script>
import jsonFn from 'json-fn';
export default {
    name: '',
    props: ['model', 'field'],
    data() {
      return {
        result: null  
      }
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
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