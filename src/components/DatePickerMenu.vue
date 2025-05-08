<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value="date"
    transition="scale-transition"
    offset="10"
    min-width="290px"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="date"
        :label="localDateLabel"
        :disabled="disabled"
        prepend-icon="event"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>
    <!-- <v-date-picker no-title scrollable v-model="date"></v-date-picker> -->

    <v-date-picker
      v-model="date"
      no-title
      scrollable
      :allowed-dates="allowedDates"
    >
      <v-spacer></v-spacer>
      <v-btn  variant="text" color="primary" @click="menu = false"
        >Cancel</v-btn
      >
      <v-btn  variant="text" color="primary" @click="$refs.menu.save(date)"
        >OK</v-btn
      >
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment';
export default {
  name: 'DatePickerMenu',

  props: {
    disabled: {
      type: Boolean
    },
    value: {
      type: String
    },
    allowed: {
      type: Array
    },
    dateLabel: {
      type: String
    }
  },

  data() {
    return {
      menu: false
    };
  },

  computed: {
    date: {
      get() {
        if (!this.value) {
          if (this.allowed) {
            var date = new Date();
            date.setDate(date.getDate());
            console.log('###', date.toISOString().substring(0, 10));
            return new Date(date.toISOString().substring(0, 10));
          } else {
            console.log('$$$', moment().locale('zh-cn').format('YYYY-MM-DD'));
            console.log(
              '$$$',
              typeof moment().locale('zh-cn').format('YYYY-MM-DD')
            );

            return new Date(moment().locale('zh-cn').format('YYYY-MM-DD'));
          }
        }
        return this.value.substring(0, 10);
      },
      set(value) {
        if (!this.value) {
          value = value + 'T' + new Date().toISOString().substring(11, 19);
        } else {
          value = value + 'T' + this.value.substring(11, 19);
        }
        this.$emit('input', value);
      }
    },
    localDateLabel: {
      get() {
        if (!this.dateLabel) {
          return 'Select Date';
        }
        return this.dateLabel;
      }
    }
  },
  methods: {
    allowedDates(val) {
      if (this.allowed && this.allowed.length > 0) {
        if (this.allowed.indexOf(val) >= 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }
};
</script>
