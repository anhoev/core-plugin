<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row>
      <v-menu v-model="menu" z-index="10000"
              :close-on-content-click="false"
              full-width
      >
        <template v-slot:activator="{ on }">
          <v-text-field class="g-text-field"
                        v-on="on"
                        v-model="model[field.key]"
                        :label="field.tableCell ? '': field.label || field.key"
                        readonly
          >
            <v-icon slot="append" style="opacity: 0.5;" @click.stop="clearTime" v-if="field.clearable">clear</v-icon>
            <v-icon slot="append" style="padding-right: 4px;" v-if="field.showIcon">access_time</v-icon>
          </v-text-field>
        </template>

        <v-time-picker format="24hr"
                       v-if="menu"
                       v-model="model[field.key]"
                       @click:minute="closeMenu()"
        ></v-time-picker>
      </v-menu>
    </v-layout>
  </v-flex>
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
