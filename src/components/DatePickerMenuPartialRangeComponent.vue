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
        readonly
        v-bind="props"
      >
        <template v-slot:prepend>
          <v-icon color="primary" icon="mdi-calendar"></v-icon>
        </template>
      </v-text-field>
    </template>

    <VueDatePicker
      inline
      v-model="date"
      range
      position="center"
      format="yyyy-MM-dd"
      model-type="yyyy-MM-dd"
      :partial-range="false"
      :enable-time-picker="false"
      teleport-center
    />
  </v-menu>
</template>



<script>
import { format } from 'date-fns';

export default {
  name: 'DatePickerMenuPartialRangeComponentVue',
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
  created() {
    if (this.modelValue) {
      this.date = [...this.modelValue];
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
      return this.date.join('~');
    }
  },
  data() {
    return {
      date: null,
      menu: false
    };
  },
  watch: {
    date: function (newData) {
      if (newData) {
        this.$emit('update:modelValue', [...newData]);
        this.menu = false;
      }
    }
  }
};
</script>