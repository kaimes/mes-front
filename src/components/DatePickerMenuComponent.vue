<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value="date"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="dataShowValue"
        :label="localDateLabel"
        :disabled="disabled"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>

    <!-- inline  关闭menu 自然也就关闭 了 datepicker 状态 -->
    <VueDatePicker
      v-model="date"
      inline
      :disabled="disabled"
      format="yyyy-MM-dd"
      :enable-time-picker="false"
      year-first
      :placeholder="localDateLabel"
    ></VueDatePicker>
  </v-menu>
</template>

<script>
import { format, parseISO } from 'date-fns';

export default {
  name: 'DatePickerMenuComponent',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      String
    },
    allowed: {
      type: Array
    },
    dateLabel: {
      type: String
    }
  },

  computed: {
    localDateLabel: {
      get() {
        if (!this.dateLabel) {
          return 'Select Date';
        }
        return this.dateLabel;
      }
    },
    dataShowValue: function () {
      return format(this.date, 'yyyy-MM-dd');
    },
    date: {
      get() {
        if (!this.modelValue) {
          return new Date();
        } else {
          return parseISO(this.modelValue, 'yyyy-MM-dd');
        }
      },
      set(value) {
        if (value) {
          let date_ymd = '';
          if (typeof value == 'string') {
            date_ymd = value;
          } else {
            date_ymd = format(value, 'yyyy-MM-dd');
          }
          const result = date_ymd + 'T' + this.modelValue.substring(11, 19);
          this.$emit('update:modelValue', result);
          this.menu = false;
        }
      }
    }
  },
  data() {
    return {
      menu: false
    };
  }
};
</script>