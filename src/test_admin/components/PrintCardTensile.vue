<template>
  <div class="a6">
    <div class="d-flex position-relative justify-center align-center mb-6">
      <div class="text-subtitle-1 font-weight-bold text-center">
        === TENSILE TEST CARD ===<br>
        === MEDIUM SECTION MILL ===
      </div>
      <div class="position-absolute right-0 bottom-0">
        <span class="text-subtitle-1 font-weight-bold text-center">{{ currentDate }}</span>
      </div>
    </div>
    <table class="table-one">
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
        <td>STD: {{ tableData?.spec?.standard?.padStart(2, '0') }}</td>
      </tr>

      <tr>
        <th colspan="2" class="text-center">HEAT TRTD</th>
        <th colspan="2" class="text-center">TESTED</th>
      </tr>
      </tbody>
    </table>

    <br/>

    <table class="table-two">
            <thead>
              <tr>
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;"></th>
                <th class="text-center">DIMS OF</th>
                <th class="text-center">TEST</th>
                <th class="text-center" style="text-align: left;">PC</th>
                <th style="border-left:  solid black; height: 20px; text-align: center; vertical-align: top;">MINYS</th>
                <th class="text-center" style="text-align: left;">{{ tableData?.tensile_object?.yield_min }}</th>
                <th style="border-left:  solid black; height: 20px; text-align: right; vertical-align: top;">U &nbsp;&nbsp; {{ tableData?.tensile_object?.tensile_min }}</th>
                <th style="border-right:  solid black; height: 20px; text-align: left; vertical-align: top;">/ &nbsp; {{ tableData?.tensile_object?.tensile_max }}</th>
                <th class="text-center">{{ tableData?.tensile_object?.elong_min_value }}MIN</th>
              </tr>
              <tr>
                <th style="border-right:  solid black; height: 20px; text-align: left; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">WDTH</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">THCK</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">AREA</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">KN</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">N/MM2</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">KN</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">N/MM2</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">{{ displayValue }}</th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>

              </tr>

              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>
                
              </tr>


              <tr>
              
                <th style="border-right:  solid black; height: 15px; text-align: left; vertical-align: top;">TEST</th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 15px; text-align: center; vertical-align: top;"></th>
                
              </tr>



              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;">&emsp;0 &emsp; {{ tableData?.tensile_object?.check_digit_1}} </th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                
              </tr>


              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">----------</th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>
                
              </tr>



              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;">&emsp;1 &emsp; {{ tableData?.tensile_object?.check_digit_2}} </th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                
              </tr>



              <tr>
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;">&emsp;2 &emsp; {{ tableData?.tensile_object?.check_digit_3}} </th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
              </tr>



              <tr>
                <th style="border-right:  solid black; height: 13px; text-align: left; vertical-align: top;">RETEST</th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="height: 13px; text-align: center; vertical-align: top;"></th>
               
              </tr>

            </thead>
            <tbody>
            </tbody>
          </table>

    <div class="text-center">
      <vue-js-barcode
          :value="`${tableData.test_code}` + `${ tableData?.spec?.standard?.padStart(2, '0') }` + 0 + `${tableData?.tensile_object?.check_digit_1}`"
          format="CODE39"
          :height="50"
          display-value="false"
      ></vue-js-barcode>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, toRefs, onMounted, computed} from "vue";
import VueJsBarcode from 'vue-jsbarcode';

const props = defineProps(['tableData']);

const displayValue = computed(() => {
  const standard = props.tableData?.spec?.standard;
  const spec_code = props.tableData?.spec.spec_code;
  const hasElongation = props.tableData?.tensile_object?.elongation_a50 !== undefined;

  if (spec_code === "120") return "EL4"
  if (standard === "1") return "EL1";
  if (standard === "2") return "EL2";
  return ""; // 什么都不显示
});

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
  border-collapse: collapse;
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
  bottom: 2px; /* Adjust this value as needed */
  width: 100%;
  text-align: center;
}
</style>
