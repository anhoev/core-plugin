<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row="">
      <v-menu v-model="showMenu" lazy="" ref="menu" left="" bottom="" min-width="290px" max-width="330px" :close-on-content-click="false" z-index="10000">
        <template v-slot:activator="{ on }">
          <v-text-field class="custom-text-field" v-model="selectedDateTime" v-on="on" :label="field.tableCell ? '': field.label || field.key" readonly="">
            <v-icon slot="append" style="opacity: 0.5;" @click.stop="clearDate" v-if="field.clearable">clear</v-icon>
            <v-icon slot="append" style="padding-right: 4px" v-if="field.showIcon">event</v-icon>
          </v-text-field>
        </template>
        <v-card :key="keyCard">
          <v-card-text style="padding: 0 !important;">
            <v-tabs centered="" grow="" v-model="showTab">
              <v-tab key="datePicker">
                <v-icon>event</v-icon>
              </v-tab>
              <v-tab key="timePicker" :disabled="!datePicked" v-if="field.pickerType === 'datetime'">
                <v-icon>access_time</v-icon>
              </v-tab>
              <v-tabs-items>
                <v-tab-item>
                  <v-date-picker v-model="date" :type="datePickerType" scrollable="">
                  </v-date-picker>
                </v-tab-item>
                <v-tab-item :disabled="!datePicked" v-if="field.pickerType === 'datetime'">
                  <v-time-picker v-model="time" :format="timePickerFormat" :use-seconds="field.pickSeconds"></v-time-picker>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat="" color="success" @click="getCurrentDateTime">Now</v-btn>
            <v-btn flat="" color="blue darken-1" @click="showMenu = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-layout>
  </v-flex>
</template>
<script>
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  name: 'DatePicker',
  props: ['model', 'field', 'noFlex'],

  data() {
    return {
      showMenu: false,
      datePicked: false,
      showTab: 0,
      keyCard: 0
    };
  },

  created() {
    if (this.model[this.field.key]) {
      this.datePicked = true;
    }
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
    },

    computedModel: {
      get() {
        return this.model[this.field.key];
      },

      set(value) {
        this.$set(this.model, this.field.key, value);
      }

    },

    selectedDateTime() {
      if (this.computedModel) {
        if (this.field.pickerType === 'date') {
          return dayjs(this.computedModel).format('DD/MM/YYYY');
        } else if (this.field.pickerType === 'month') {
          return dayjs(this.computedModel).format('MM/YYYY');
        } else if (this.field.pickerType === 'datetime' && !this.field.is12Hour && !this.field.pickSeconds) {
          return dayjs(this.computedModel).format('DD/MM/YYYY HH:mm');
        } else if (this.field.pickerType === 'datetime' && this.field.is12Hour && this.field.pickSeconds) {
          return dayjs(this.computedModel).format('DD/MM/YYYY hh:mm:ss A');
        } else if (this.field.pickerType === 'datetime' && this.field.pickSeconds && !this.field.is12Hour) {
          return dayjs(this.computedModel).format('DD/MM/YYYY HH:mm:ss');
        } else if (this.field.pickerType === 'datetime' && this.field.is12Hour && !this.field.pickSeconds) {
          return dayjs(this.computedModel).format('DD/MM/YYYY hh:mm A');
        } else {
          return dayjs(this.computedModel).format('YYYY-MM-DD[T]HH:mm');
        }
      }

      return '';
    },

    datePickerType() {
      if (this.field) {
        if (this.field.pickerType === 'month') {
          return 'month';
        }

        return 'date';
      }

      return 'date';
    },

    date: {
      get() {
        const model = this.computedModel;
        return model ? dayjs(model).format('YYYY-MM-DD') : '';
      },

      set(value) {
        const date = dayjs(value);
        const year = date.year();
        const month = date.month();
        const dayOfMonth = date.date() ? date.date() : 1;
        this.computedModel = dayjs(new Date(year, month, dayOfMonth)).toDate();
        this.datePicked = true;
        this.showTab = 1;
      }

    },
    time: {
      get() {
        const model = this.computedModel;
        return model ? dayjs(model).format('HH:mm:ss') : '';
      },

      set(value) {
        const [hour, minute, seconds] = value.split(':');
        this.computedModel = dayjs(this.computedModel).set('hour', hour).set('minute', minute).set('second', seconds ? seconds : 0).toDate();
      }

    },

    timePickerFormat() {
      if (this.field.is12Hour) {
        return 'ampm';
      }

      return '24hr';
    }

  },
  methods: {
    getCurrentDateTime() {
      this.computedModel = dayjs().toDate();
      this.datePicked = true;
      this.showTab = 1;
      this.showMenu = false;
    },

    clearDate() {
      if (!this.computedModel) {
        return;
      }

      this.computedModel = null;
      this.datePicked = false;
      this.showTab = 0;
      this.keyCard++;
    }

  }
};
exports.default = _default;
</script> 
<style>
</style>
