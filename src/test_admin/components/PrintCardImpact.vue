<template>
  <div class="a6">
    <div class="d-flex position-relative justify-center align-center mb-6">
      <div class="text-subtitle-1 font-weight-bold text-center">
        === IMPACT TEST CARD ===<br>
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
        <td colspan="3">SPEC: {{ tableData?.spec?.summary_name }}   </td>
        <td colspan="3" > <span>{{ tableData?.impact_object?.temp_c }}</span> </td>
        <td colspan="6">
          <span v-if="tableData?.mill_id === 1">
            <span v-if="tableData?.impact_object?.temp_c != null">
              {{ tableData?.impact_object?.temp_c }}C
            </span>
            <span v-else>
              {{ tableData?.impact_object?.temp_f }}F
            </span>
          </span>
        </td>


      </tr>
      </tbody>
      <br>

    </table>

    <table class="table-two">
      <thead>
        <tr>
          <td style="border-right:  solid black; height: 35px; text-align: center; vertical-align: top;">HEAT TRTD</td>
          <td style="border-right:  solid black; height: 35px; text-align: center; vertical-align: top;">SAWN</td>
          <td style="border-right:  solid black; height: 35px; text-align: center; vertical-align: top;">MACHINED</td>
          <td style=" height: 50px; text-align: center; vertical-align: top;">TESTED</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>

          <td>
            {{ tableData?.impact_object?.size_code === '1' ? '10x10' :
              tableData?.impact_object?.size_code === '2' ? '10x7.5' :
              tableData?.impact_object?.size_code === '3' ? '10x5' : '' }}
          </td>

          <td>{{ tableData?.impact_object?.notch }}</td>
          <td>MIN.AV. {{ tableData?.impact_object?.min_average }}</td>
          <td>MIN.SING. {{ tableData?.impact_object?.min_single }}</td>
         
        </tr>
        
      </thead>
    </table>
    <br/>

      <div class="left">
        <table class="table-two">
            <thead>
              <tr>
                <th style="border-right:  solid black; height: 20px; text-align: left; vertical-align: top;">TEST</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">J1</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">J2</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">J3</th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>

                <th></th>
                <th style="border-right:  solid black;border-left:  solid black; height: 20px; text-align: center; vertical-align: top;">-------------------</th>
              </tr>
              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;">0 &emsp; {{ tableData?.impact_object?.check_digit_1 }}&emsp;</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th></th>
                <th></th>
                <th style="border-right:  solid black;border-left:  solid black; height: 20px; text-align: left; vertical-align: top;">&emsp;&emsp;RACK</th>
              </tr>
              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">--------------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">--------------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">--------------</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;">--------------</th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>
                <th></th>
                <th style="border-right:  solid black;border-left:  solid black; height: 20px; text-align: center; vertical-align: top;">-------------------</th>
              </tr>

              <tr>
                
                <th style="border-right:  solid black; height: 20px; text-align: right; vertical-align: top;">1 &emsp; {{ tableData?.impact_object?.check_digit_2 }}&emsp;</th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 20px; text-align: center; vertical-align: top;"></th>
                <th></th>
                <th></th>
                <th style="border-right:  solid black;border-left:  solid black; height: 20px; text-align: left; vertical-align: top;">&emsp;&emsp;STAMP CODE <br/> &emsp;&emsp;&emsp;&emsp;{{ tableData?.test_code?.slice(-3) }}</th>
              </tr>

              <tr>
                <th style="border-right:  solid black; height: 13px; text-align: left; vertical-align: top;">RETEST</th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="border-right:  solid black; height: 13px; text-align: center; vertical-align: top;"></th>
                <th style="height: 20px; text-align: center; vertical-align: top;"></th>
                <th></th>
                <th style="border-right:  solid black;border-left:  solid black; height: 20px; text-align: center; vertical-align: top;">-------------------</th>
              </tr>

            </thead>
            <tbody>
            </tbody>
          </table>
      </div>
    <v-row class="mt-auto justify-center">
      <vue-js-barcode
          :value="`${tableData.test_code}` + `${ tableData?.spec?.standard?.padStart(2, '0') }` + 0 + `${tableData?.tensile_object?.check_digit_1}`"
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
.container  {
  display: flex;
  width: 100%;
}


/* 左侧 65% */
.left {
  width: 100%;
  text-align: left;
}



.table-one, .table-two {
  border-collapse: collapse;
  width: 100%;
}

.table-three {
  border-collapse: collapse;
  width: 75%;
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
  
