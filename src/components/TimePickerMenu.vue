<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    :return-value="time"
    transition="scale-transition"
    offset="10"
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="time"
        :label="lable || 'Select Time'"
        :disabled="disabled"
        prepend-icon="access_time"
        readonly
        v-bind="props"
      ></v-text-field>
    </template>
    <v-time-picker
      v-model="time"
      full-width
      @click:minute="$refs.menu.save(time)"
      :allowed-hours="allowedHours"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import moment from "moment";
export default {
  name: "TimePickerMenu",

  props: {
    disabled: {
      type: Boolean,
    },
    value: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    lable: {
      type: String,
    },
  },

  data() {
    return {
      menu: false,
    };
  },

  computed: {
    time: {
      get() {
        if (!this.value) {
          return moment().locale("zh-cn").format("HH:mm");
        }
        return this.value.substring(11, 16);
      },
      set(value) {
        if (!this.value) {
          value = new Date().toISOString().substring(0, 10) + "T" + value;
        } else {
          value = this.value.substring(0, 10) + "T" + value;
        }
        this.$emit("input", value);
      },
    },
  },
  methods: {
    allowedHours(val) {
      // console.info("this.startTime:" + this.startTime);
      // console.info("this.endTime:" + this.endTime);
      if (this.startTime && this.startTime.length > 0) {
        let start = Math.floor(parseInt(this.startTime) / 100);
        let end = Math.floor(parseInt(this.endTime) / 100);
        if (val >= start && val <= end) {
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
