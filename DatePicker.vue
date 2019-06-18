<template>
  <v-flex :class="flex" class="px-2">
    <v-layout row>
      <v-menu v-model="showMenu"
              lazy
              ref="menu"
              left bottom
              min-width="290px"
              max-width="330px"
              :close-on-content-click="false"
              z-index="10000"
      >
        <template v-slot:activator="{ on }">
          <v-text-field :class="field.tableCell ? 'g-text-field' : ''"
                        v-model="selectedDateTime"
                        v-on="field.textEditable ? null : on"
                        :label="field.tableCell ? '': field.label || field.key"
                        @input="onInput"
                        :readonly="!field.textEditable"
                        :mask="inputMask"
                        :return-masked-value="true"
                        :rules="[inputRules.validDate]"
          >
            <v-icon slot="append" style="opacity: 0.5;" @click.stop="clearDate" v-if="field.clearable">clear</v-icon>
            <v-icon slot="append" style="padding-right: 4px" v-if="field.showIcon"
                    v-on="field.textEditable ? on : null">event
            </v-icon>
          </v-text-field>
        </template>
        <v-card :key="keyCard">
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
        showMenu: false,
        datePicked: false,
        showTab: 0,
        keyCard: 0,
        inputRules: {
          validDate: false
        }
      };
    },
    created() {
      if (this.model[this.field.key]) {
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
          return this.model[this.field.key];
        },
        set(value) {
          this.$set(this.model, this.field.key, value);
        }
      },
      selectedDateTime: {
        get() {
          if (this.computedModel) {
            return dayjs(this.computedModel).format(this.getDateFormat());
          }
          return '';
        },
        set(v) {
          return v;
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
          this.computedModel = dayjs(this.computedModel)
            .set('hour', hour)
            .set('minute', minute)
            .set('second', seconds ? seconds : 0)
            .toDate();
        }
      },
      timePickerFormat() {
        return '24hr';
      },
      inputMask() {
        return this.getDateFormat().replace(/([DMYHhms])./g, '##').replace(/[[\[\]]/g, '');
      }
    },
    methods: {
      getDateFormat() {
        if (this.field.pickerType === 'date') {
          return 'DD/MM/YYYY';
        } else if (this.field.pickerType === 'month') {
          return 'MM/YYYY';
        } else if (this.field.pickerType === 'datetime') {
          if (this.field.pickSeconds) {
            return 'DD/MM/YYYY HH:mm:ss';
          }
          return 'DD/MM/YYYY HH:mm';
        } else {
          return 'YYYY-MM-DD[T]HH:mm:ss';
        }
      },
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
      },
      onInput: _.debounce(function(e) {
        if (e === '') {
          this.computedModel = null;
        }
        const inputDateTime = dayjs(e, this.getDateFormat());

        const dateFormat = this.getDateFormat().replace(/[[\[\]]/g, '');
        Object.assign(this.inputRules, {
          validDate: (!e || inputDateTime.isValid()) || `Please use correct date format (${dateFormat})`
        });

        if (inputDateTime.isValid()) {
          this.computedModel = inputDateTime.toDate();
          this.datePicked = true;
        }
      }, 500)
    }
  };
</script>

<style>
</style>
