<template>
  <v-flex :class="flex">
    <v-subheader>{{field.label || field.key}}:  {{result}}</v-subheader>
  </v-flex>
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
  computed: {
    flex() {
      return this.noLayout ? 'xs-12' : this.field.flex;
    }

  },

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
      const fn = _jsonFn.default.clone(this.field.fn, true, true).bind(this.rootModel);

      this.result = fn();
    }

  }
};
exports.default = _default;
</script> 
<style scoped>

</style>
