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
        prepend-icon="mdi-clock-outline"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>

    <VueDatePicker
      v-model="date"
      inline
      :disabled="disabled"
      format="HH:mm"
      model-type="HH:mm"
      time-picker
    ></VueDatePicker>
  </v-menu>
</template>

<script>
import { format, parseISO } from 'date-fns';

export default {
  name: 'TimePickerMenuComponent',
  props: {
    disabled: {
      type: Boolean
    },
    modelValue: {
      String
    }, 
    startTime: {
      type: String
    },
    endTime: {
      type: String
    },
    lable: {
      type: String
    }
  },

  computed: {
    localDateLabel: {
      get() {
        if (!this.lable) {
          return 'Select Time';
        }
        return this.lable;
      }
    },
    dataShowValue: function () {
      if (this.date.constructor.name == 'String') {
        return this.date;
      }
      return format(this.date, 'HH:mm');
    },
    date: {
      get() {
        if (!this.modelValue) {
          return new Date();
        } else {
          return parseISO(this.modelValue);
        }
      },
      set(newData) {
        if (newData && newData.constructor.name == 'String') {
          let date_ymd;
          if (!this.modelValue) {
            date_ymd = format(new Date(), 'yyyy-MM-dd');
          } else {
            date_ymd = this.modelValue.substring(0, 10);
          }
          this.$emit('update:modelValue', date_ymd + 'T' + newData);
          this.menu = false;
        }
      }
    }
  },
  data() {
    return {
      // date: null,
      menu: false
    };
  }
};
</script>