<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row>
      <v-menu v-model="showMenu"
              lazy
              ref="menu"
              left bottom
              max-width="290px"
              :close-on-content-click="false"
              z-index="10000"
      >
        <template v-slot:activator="{ on }">
          <v-text-field class="custom-text-field"
                        v-model="computedModel"
                        v-on="on"
                        :label="field.tableCell ? '': field.label || field.key"
                        readonly
          >
            <v-icon slot="append" style="opacity: 0.5;" @click.stop="clearDate">clear</v-icon>
            <v-icon slot="append" style="padding-right: 4px">event</v-icon>
          </v-text-field>
        </template>
        <v-card>
          <v-card-text style="padding: 0 !important;">
            <v-tabs centered grow v-model="showTab">
              <v-tab key="datePicker">
                <v-icon>event</v-icon>
              </v-tab>
              <v-tab key="timePicker" :disabled="!datePicked" v-if="field.pickerType === 'datetime'">
                <v-icon>access_time</v-icon>
              </v-tab>
              <v-tabs-items>
                <v-tab-item>
                  <v-date-picker v-model="date"
                                 :type="datePickerType"
                                 scrollable
                  >
                  </v-date-picker>
                </v-tab-item>
                <v-tab-item :disabled="!datePicked" v-if="field.pickerType === 'datetime'">
                  <v-time-picker v-model="time" :format="timePickerFormat" :use-seconds="field.pickSeconds"
                  ></v-time-picker>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="success" @click="getCurrentDateTime">Now</v-btn>
            <v-btn flat color="blue darken-1" @click="showMenu = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-layout>
  </v-flex>
</template>

<script>

  export default {
    name: 'DatePicker',
    props: ['model', 'field', 'noFlex'],
    data() {
      return {
        menu: false,
        showMenu: false,
        selectedDateTime: null,
        datePicked: false,
        timePicked: false,
        showTab: 0
      };
    },
    created() {
      if (this.model[this.field.key]) {
        this.selectedDateTime = this.model[this.field.key];
        this.datePicked = true;
      }
    },
    inject: {
      rootModel: { default: null },
      path: { default: null },
      noLayout: { default: null }
    },
    computed: {
      flex() {
        return this.noLayout ? 'xs-12' : this.field.flex;
      },
      computedModel: {
        get() {
          this.computedModel = this.selectedDateTime;
          if (this.selectedDateTime) {
            if (this.field.pickerType === 'date') {
              return dayjs(this.selectedDateTime).format('DD/MM/YYYY');
            } else if (this.field.pickerType === 'month') {
              return dayjs(this.selectedDateTime).format('MM/YYYY');
            } else if (this.field.pickerType === 'datetime' && !this.field.is12Hour && !this.field.pickSeconds) {
              return dayjs(this.selectedDateTime).format('DD/MM/YYYY HH:mm');
            } else if (this.field.pickerType === 'datetime' && this.field.is12Hour && this.field.pickSeconds) {
              return dayjs(this.selectedDateTime).format('DD/MM/YYYY hh:mm:ss A');
            } else if (this.field.pickerType === 'datetime' && this.field.pickSeconds && !this.field.is12Hour) {
              return dayjs(this.selectedDateTime).format('DD/MM/YYYY HH:mm:ss');
            } else if (this.field.pickerType === 'datetime' && this.field.is12Hour && !this.field.pickSeconds) {
              return dayjs(this.selectedDateTime).format('DD/MM/YYYY hh:mm A');
            } else {
              return dayjs(this.selectedDateTime).format('YYYY-MM-DD[T]HH:mm');
            }
          }
          return '';
        },
        set(value) {
          this.$set(this.model, this.field.key, value);
        }
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
          return this.selectedDateTime ? dayjs(this.selectedDateTime).format('YYYY-MM-DD') : '';
        },
        set(value) {
          const date = dayjs(value);
          const year = date.year();
          const month = date.month();
          const dayOfMonth = date.date() ? date.date() : 1;
          this.selectedDateTime = dayjs(new Date(year, month, dayOfMonth)).toDate();
          this.datePicked = true;
          this.showTab = 1;
        }
      },
      time: {
        get() {
          return this.selectedDateTime ? dayjs(this.selectedDateTime).format('HH:mm:ss') : '';
        },
        set(value) {
          const [hour, minute, seconds] = value.split(':');
          this.selectedDateTime = dayjs(this.selectedDateTime)
            .set('hour', hour)
            .set('minute', minute)
            .set('seconds', seconds)
            .toDate();
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
        this.selectedDateTime = dayjs().toDate();
        this.datePicked = true;
        this.showTab = 1;
        this.showMenu = false;
      },
      clearDate() {
        this.selectedDateTime = null;
      }
    }
  };
</script>

<style>
</style>
