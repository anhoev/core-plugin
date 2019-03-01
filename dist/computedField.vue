<template>
  <div>
    <v-btn small="" depressed="" @click="compute">compute</v-btn>
    {{result}}
  </div>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonFn = _interopRequireDefault(require("json-fn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: '',
  props: ['model', 'field'],

  data() {
    return {
      result: null
    };
  },

  inject: {
    rootModel: {
      default: null
    },
    path: {
      default: null
    }
  },
  methods: {
    compute() {
      const fn = _jsonFn.default.clone(this.field.fn, true, true).bind(this.rootModel);

      this.result = fn();
    }

  }
};
exports.default = _default;
</script> 
<style scoped>

</style>
