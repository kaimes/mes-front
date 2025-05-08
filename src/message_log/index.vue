<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch" @keyup.enter="handleSearch">
      <v-row align="center">

        <v-col cols="2">
          <v-text-field
              v-model="message_id"
              label="Search By Message Id"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="5">
          <v-text-field
              v-model="q"
              label="Search By Message Type, Message Status, Message"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t('global.reset') }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t('global.search') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          fixed-header
          height="650"
          show-current-page
          :headers="headers"
          :items="items"
          :footer-props="{
            'items-per-page-options': [5, 10, 20]
          }"
          :items-length="total || 0"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          v-model:sort-by="sortBy"
          v-model:sort-desc.sync="descending"
          :loading="loading"
          loading-text="Loading... Please wait"
      >
        <template v-slot:[`item.message_json`]="{ item }">
          <span class="clickable" @click="showFullJson(item.message_json)">
            {{ truncateJson(item.message_json) }}
          </span>
        </template>
        <template v-slot:[`item.msg_type`]="{ item }">
           <span>{{ item.msg_type === 0 ? 'sending' : (item.msg_type === 1 ? 'receiving' : '') }}</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn flat color="primary" @click="repeatItem1(item)" v-permission="`Repeat`">Repeat</v-btn>
        </template>
        <template v-slot:[`item.code`]="{ item }">
          <v-tooltip bottom max-width="500px" :text="item.code">
            <template v-slot:activator="{ props }">
              <span class="code" v-bind="props">
                {{ item.code }}
              </span>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:[`item.geo_address_text`]="{ item }">
          <v-tooltip bottom max-width="500px" :text="item.geo_address_text">
            <template v-slot:activator="{ props }">
              <span class="overflow_ellipsis_col" v-bind="props">
                {{ item.geo_address_text }}
              </span>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:[`item.msg`]="{ item }">
          <span class="clickable" @click="showFullMessage(item.msg)">
            {{ truncateText(item.msg) }}
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn flat color="primary" @click="repeatItem1(item)" v-permission="`Repeat`">Repeat</v-btn>
        </template>
      </v-data-table-server>
    </v-card>
    <v-dialog ref="jsonDialog" v-model="dialogVisible" max-width="800px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text class="scrollable-content">
          <pre id="dialog-pre">{{ fullContent }}</pre>
          <v-btn color="primary" @click="copyContent" class="mt-2">Copy {{ dialogTitle }}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { mapActions, mapState } from 'vuex';
import { toast } from "vue3-toastify";
import { formatDate } from "@/util/util";
import { useI18n } from 'vue-i18n';

export default {
  name: 'MessageLogTable',
  data() {
    return {
      translateHeaders: [
        { title: 'message_log.table.message_type', value: 'type', sortable: true },
        { title: 'message_log.table.message_id', value: 'message_id', sortable: true },
        { title: 'message_log.table.message', value: 'msg', sortable: true },
        {
          title: 'message_log.table.message_json',
          value: 'message_json',
          sortable: true,
          align: 'start',
          cellClass: 'json-cell'
        },
        // { title: 'Message Interact', value: 'interact', sortable: true },
        { title: 'message_log.table.interact_from', value: 'interact_from', sortable: true },
        { title: 'message_log.table.interact_to', value: 'interact_to', sortable: true },
        { title: 'message_log.table.interact_type', value: 'msg_type', sortable: true },
        { title: 'message_log.table.created_at', key: 'created_at', value: (row) => formatDate(row.created_at), sortable: true },
        // { title: 'Status', value: 'message_status', sortable: true },
        { title: '', value: 'actions', sortable: false, align: 'end' }
      ],
      dialogVisible: false,
      fullJson: '',
      fullMessage: '',
      dialogTitle: 'Message JSON'
    };
  },
  computed: {
    ...mapState('auth', ['userInfo']),
    ...mapFields('message_log', [
      'table.options.q',
      'table.options.page',
      'table.options.itemsPerPage',
      'table.options.sortBy',
      'table.options.descending',
      'table.loading',
      'table.rows.items',
      'table.rows.total',
      'table.options.message_id'
    ]),
    headers(){
      return this.translateHeaders.map(header => {
        return{
          ...header,
          title: this.$t(header.title) || header.title
        }
      })
    },
    fullContent() {
      return this.dialogTitle === 'Message JSON' ? this.fullJson : this.fullMessage;
    }
  },
  mounted() {
    this.getAll({});

    this.$watch(
        (vm) => [vm.page, vm.q, vm.itemsPerPage, vm.sortBy, vm.descending],
        () => {
          this.getAll();
        }
    );
  },
  beforeDestroy() {
    this.closeCreateEdit();
  },
  methods: {
    ...mapGetters('auth', ['getPermission']),
    ...mapActions('message_log', [
      'getAll',
      'createEditShow',
      'removeShow',
      'closeCreateEdit',
      'repeatItem'
    ]),
    ...mapActions('job', ['showJobEdit4Customer']),
    clickNewJobOnLocation(item) {
      this.showJobEdit4Customer({job: null, loc: item});
    },
    truncateJson(jsonStr, maxLength = 20) {
      if (!jsonStr) {
        return '';
      }
      return jsonStr.length > maxLength ? `${jsonStr.substring(0, maxLength)}...` : jsonStr;
    },
    truncateText(text, maxLength = 50) {
      if (!text) {
        return '';
      }
      return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    },
    showFullJson(jsonStr) {
      this.fullJson = jsonStr;
      this.dialogTitle = 'Message JSON';
      this.dialogVisible = true;
    },
    showFullMessage(msg) {
      this.fullMessage = msg;
      this.dialogTitle = 'Message';
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    copyContent() {
      const preElement = document.getElementById('dialog-pre');
      const range = document.createRange();
      window.getSelection().removeAllRanges();
      range.selectNode(preElement);
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      toast.success(`${this.dialogTitle} copied to clipboard!`);
    },
    repeatItem1(item) {
        console.log('Repeat button clicked', typeof item.type);
        this.repeatItem(item.id)
            .then(() => {
                // 成功时的提示
                toast.success('Item repeated successfully!');
                this.getAll({});
            })
            .catch((error) => {
                // 失败时的提示
                let errorMessage = 'Failed to repeat item.';
                if (error.response && error.response.data && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
                console.error('Error repeating item:', error);
                toast.error(errorMessage, { autoClose: 60000 });
            });
    },
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      this.q = ""; // 确保 q 被重置为空字符串
      this.message_id = undefined;
      this.getAll();
    }
  }
};
</script>

<style scoped>.scrollable-content {
  overflow-x: auto;
  white-space: pre-wrap; /* 保留换行符 */
}
</style>
