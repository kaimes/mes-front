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
        v-model="date"
        :label="localDateLabel"
        :disabled="disabled"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>

    <VueDatePicker
      range
      inline
      format="yyyy-MM-dd"
      model-type="yyyy-MM-dd"
      :partial-range="false"
      :enable-time-picker="false"
      teleport-center
    >
      <template #input-icon>
        <v-icon icon="mdi-calendar-edit" size="30px" />
      </template>
    </VueDatePicker>
  </v-menu>
</template>

<script>
import moment from "moment";
import DatePickerMenuPartialRangeComponent from '@/components/DatePickerMenuPartialRangeComponent.vue';

export default {
  name: "VueDatePickerMenu",
  components: {
    DatePickerMenuPartialRangeComponent
  },
  props: {
    disabled: {
      type: Boolean,
    },
    value: {
      type: String,
    },
    allowed: {
      type: Array,
    },
    dateLabel: {
      type: String,
    },
  },

  data() {
    return {
      menu: false,
    };
  },

  computed: {
    date: {
      get() {
        if (!this.value) {
          if (this.allowed) {
            var date = new Date();
            date.setDate(date.getDate());
            return date.toISOString().substring(0, 10);
          } else {
            return moment().locale("zh-cn").format("YYYY-MM-DD");
          }
        }
        return this.value.substring(0, 10);
      },
      set(value) {
        if (!this.value) {
          value = value + "T" + new Date().toISOString().substring(11, 19);
        } else {
          value = value + "T" + this.value.substring(11, 19);
        }
        this.$emit("input", value);
      },
    },
    localDateLabel: {
      get() {
        if (!this.dateLabel) {
          return "Select Date";
        }
        return this.dateLabel;
      },
    },
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
    },
  },
};
</script>
