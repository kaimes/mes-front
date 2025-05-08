<template>
  <div class="a6">
    <div class="d-flex position-relative justify-center align-center mb-6">
      <div class="text-subtitle-1 font-weight-bold text-center">
        === DECARBURISATION PRINT TEST CARD ===<br>
        === MEDIUM SECTION MILL ===
      </div>
      <div class="position-absolute right-0 bottom-0">
        <span class="text-subtitle-1 font-weight-bold text-center">{{ currentDate }}</span>
      </div>
    </div>

      <table class="table-one" border="0">
        <thead>
        <tr>
          <td>CODE</td>
        <td>SECTION</td>
        <td>R.REF</td>
        <td>CAST</td>
        <td>BLOOM</td>
        <td>REF.</td>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{ tableData?.test_code }}</td>
          <td>{{ tableData?.product_type?.product_size?.desc }}</td>
          <td>{{ tableData?.product_type?.product_size?.roll_ref_code }}</td>
        <td>{{ tableData?.cast?.cast_code }}</td>
          <td>{{ tableData?.test_sample?.runout?.semi?.skelp_code }}</td>
        <td>{{ tableData?.ref_code }}</td>
        </tr>
        <tr>
        <td>&emsp;&emsp;&ensp; {{ tableData?.decarburisation_object?.check_digit_1 }}</td>
      </tr>
        <tr>
          <td colspan="3" class="text-center">---INSPECTION---</td>
          <td colspan="3" class="text-center">KG/M</td>
        </tr>
        <tr>
                  <td colspan="3" class="text-center">
          {{
            [
              tableData?.inspector_id_1 && `${tableData.inspector_1.code} - ${tableData.inspector_1.name}`,
              tableData?.inspector_id_2 && `${tableData.inspector_2.code} - ${tableData.inspector_2.name}`,
              tableData?.inspector_id_3 && `${tableData.inspector_3.code} - ${tableData.inspector_3.name}`,
              tableData?.inspector_id_4 && `${tableData.inspector_4.code} - ${tableData.inspector_4.name}`
            ]
                .filter(Boolean) // 过滤掉 false/null/undefined
                .join(', ') || '999'
          }}
        </td>
          <td colspan="3" class="text-center">{{ tableData?.product_type?.dim3 }}</td>
        </tr>
        <tr>
          <td>SPEC: {{ tableData?.spec?.summary_name }}</td>
        </tr>
        <tr>
          <td>MAX =&emsp;&emsp;&emsp;mm</td>
        </tr>
        </tbody>
      </table>

    <v-row justify="center" class="barcode-container">
      <vue-js-barcode
          :value="tableData.test_code"
          format="CODE39"
          :height="50"

          display-value="false"
      ></vue-js-barcode>
    </v-row>
  </div>
</template>

<script setup>
import {ref, reactive, toRefs, onMounted, computed} from "vue";
import VueJsBarcode from 'vue-jsbarcode';

const props = defineProps(['tableData']);
// 计算当前日期并格式化
const currentDate = computed(() => {
  const date = new Date();
  const year = String(date.getFullYear());  // 获取年份的后两位
  const month = String(date.getMonth() + 1).padStart(2, '0');  // 获取月份，注意要加1
  const day = String(date.getDate()).padStart(2, '0');  // 获取日期

  return `${day}/${month}/${year}`;  // 返回格式化后的日期
});
</script>

<style scoped>
.a6 {
  width: 100%;
  height: 145mm;
  position: relative; 

}

.table-one, .table-two {
  width: 100%;
}

table > tbody > tr:not(:last-child) > td,
table > tbody > tr:not(:last-child) > th {
  border-bottom: none;
}

table > tbody > tr > td,
table > thead > tr > th,
table > tfoot > tr > td {
  height: 12px;
  padding: 0 7px;
}

/* Barcode positioning at the bottom */
.barcode-container {
  position: absolute;
  bottom: 10px;
  width: 100%;
  text-align: center;
}
</style>

