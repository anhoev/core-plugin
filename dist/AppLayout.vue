<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app="" mobile-break-point="768">
            <v-layout justify-center="" align-center="">
                <v-flex class="pa-2">
                    <slot name="drawer"><cms-add name="drawer"></cms-add></slot>
                </v-flex>
            </v-layout>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark="" app="" dense="" flat="">
            <div slot="extension" style="height: 100%" v-if="false">
                <v-text-field label="select" light="" solo="" style="min-height: 32px"></v-text-field>
            </div>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Backoffice</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
                <slot name="toolbar-item"><cms-add name="toolbar-item"></cms-add></slot>
            </v-toolbar-items>
        </v-toolbar>
        <v-content>
            <v-container fluid="" fill-height="">
                <v-layout>
                    <slot name="content"><cms-add name="content"></cms-add></slot>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cms = _interopRequireDefault(require("cms"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'Layout',
  props: {
    model: null
  },

  data() {
    return {
      drawer: true,
      provideProps: {
        drawerItems: [],
        collectionItems: [],
        selectedDrawerItems: {},
        columns: []
      }
    };
  },

  mounted() {// this.getList('Product');
  },

  methods: {}
};
exports.default = _default;
</script> 
