<template>
  <v-container class="page" fluid>
    <div class="panel">
      <div class="panel-action">
        <span class="text-subtitle-2 font-weight-regular mr-2">{{ save ? "Save" : "View" }}</span>
        <v-switch
            v-model="save"
            density="default"
            hide-details
            inset
        ></v-switch>
        <div class="ml-14">
          <v-btn @click="handleSave" :disabled="!save" :loading="loading" variant="flat" color="primary">
            {{ form.id ? "Update" : "Create" }}
          </v-btn>
        </div>
      </div>
    </div>
    <v-form ref="editForm">
      <div class="mb-4 border rounded pa-4">
        <v-row align="center">
          <v-col cols="2">
            <!-- <v-text-field
                v-model="form.quality_element_id"
                class="no-input-control"
                label="Quality Element ID"
                tabindex="1"
                :disabled="!save"
                clearable
            ></v-text-field> -->
            <QualityCode v-model="form.quality_id" :quality="form.quality" label="Quality Code" :disabled="!save" :hide-details="false"/>
          </v-col>
          <!-- <v-col cols="3">
            <mill-code v-model="form.mill_id" :hide-details="false" tabindex="2" :disabled="!save"/>
          </v-col> -->
          <v-col cols="2">
            <dict-code
                v-model="form.type"
                label="Type"
                code="quality_element_type"
                :disabled="!save"
                tabindex="3"
                :hide-details="false"
                persistent-placeholder
            />
          </v-col>

          <v-col cols="3">
            <v-select
              clearable
              v-model="form.is_active"
              label="IsActive"
              :items="['True', 'False']"
              variant="underlined"
            ></v-select>
          </v-col>
          

          <v-col cols="2">
            <v-text-field
                type="number"
                v-model.number="form.thick_from"
                :rules="rules.thick_from"
                class="no-input-control"
                variant="underlined"
                persistent-placeholder
                label="Thick From"
                tabindex="4"
                @blur="handleBlur('thick_from')"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                v-model="form.thick_to"
                :rules="rules.thick_to"
                class="no-input-control"
                persistent-placeholder
                variant="underlined"
                tabindex="5"
                label="Thick To"
                @blur="handleBlur('thick_to')"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="mb-4 border rounded pa-4">
        <v-row align="center">
          <v-col cols="1">
            <v-text-field
                v-model="form.main_el_min_value_c"
                :rules="rules.main_el_min_value_c"
                @blur="handleBlur('main_el_min_value_c')"
                persistent-placeholder
                density="default"
                variant="underlined"
                label="Carbon Min"
                bg-color="white"
                tabindex="6"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_c"
                @blur="handleBlur('main_el_min_value_c')"
                v-model="form.main_el_max_value_c"
                persistent-placeholder
                density="default"
                variant="underlined"
                label="Carbon Max"
                bg-color="white"
                tabindex="7"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_c"
                @blur="handleBlur('precision_c', 'init')"
                v-model="form.precision_c"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Carbon Precision"
                bg-color="white"
                tabindex="8"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_c"
                @blur="handleBlur('main_el_min_value_c')"
                v-model="form.main_el_min_value_s"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Sulphur Min"
                bg-color="white"
                tabindex="9"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_s"
                @blur="handleBlur('main_el_max_value_s')"
                v-model="form.main_el_max_value_s"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Sulphur Max"
                bg-color="white"
                tabindex="10"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_s"
                @blur="handleBlur('precision_s', 'init')"
                v-model="form.precision_s"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Sulphur Precision"
                class="no-input-control"
                bg-color="white"
                tabindex="11"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_cr"
                @blur="handleBlur('main_el_min_value_cr')"
                v-model="form.main_el_min_value_cr"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Chrome Min"
                bg-color="white"
                tabindex="12"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_cr"
                @blur="handleBlur('main_el_max_value_cr')"
                v-model="form.main_el_max_value_cr"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Chrome Max"
                tabindex="13"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_cr"
                @blur="handleBlur('precision_cr', 'init')"
                v-model="form.precision_cr"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Chrome Precision"
                class="no-input-control"
                tabindex="14"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_al"
                @blur="handleBlur('main_el_min_value_al')"
                v-model="form.main_el_min_value_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Alumin Min"
                tabindex="15"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_al"
                @blur="handleBlur('main_el_max_value_al')"
                v-model="form.main_el_max_value_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Alumin Max"
                tabindex="16"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_al"
                @blur="handleBlur('precision_al', 'init')"
                v-model="form.precision_al"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Alumin Precision"
                class="no-input-control"
                tabindex="17"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_cu"
                @blur="handleBlur('main_el_min_value_cu')"
                v-model="form.main_el_min_value_cu"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Copper Min"
                tabindex="18"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_cu"
                @blur="handleBlur('main_el_max_value_cu')"
                v-model="form.main_el_max_value_cu"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Copper Max"
                tabindex="19"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_cu"
                @blur="handleBlur('precision_cu', 'init')"
                v-model="form.precision_cu"
                density="default"
                variant="underlined"
                label="Copper Precision"
                class="no-input-control"
                persistent-placeholder
                tabindex="20"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_ti"
                @blur="handleBlur('main_el_min_value_ti')"
                v-model="form.main_el_min_value_ti"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Titanium Min"
                tabindex="21"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_ti"
                @blur="handleBlur('main_el_max_value_ti')"
                v-model="form.main_el_max_value_ti"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Titanium Max"
                tabindex="22"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_ti"
                @blur="handleBlur('precision_ti', 'init')"
                v-model="form.precision_ti"
                density="default"
                variant="underlined"
                label="Titanium Precision"
                persistent-placeholder
                tabindex="23"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_ca"
                @blur="handleBlur('main_el_min_value_ca')"
                v-model="form.main_el_min_value_ca"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="24"
                label="Calcium Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_ca"
                @blur="handleBlur('main_el_max_value_ca')"
                v-model="form.main_el_max_value_ca"
                density="default"
                variant="underlined"
                persistent-placeholder
                tabindex="25"
                label="Calcium Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_ca"
                @blur="handleBlur('precision_ca', 'init')"
                v-model="form.precision_ca"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Calcium Precision"
                tabindex="26"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_si"
                @blur="handleBlur('main_el_min_value_si')"
                v-model="form.main_el_min_value_si"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="27"
                label="Silicon Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_si"
                @blur="handleBlur('main_el_max_value_si')"
                v-model="form.main_el_max_value_si"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="28"
                label="Silicon Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_si"
                @blur="handleBlur('precision_si', 'init')"
                v-model="form.precision_si"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Silicon Precision"
                class="no-input-control"
                tabindex="29"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_p"
                @blur="handleBlur('main_el_min_value_p')"
                v-model="form.main_el_min_value_p"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="27"
                label="Phosphorus Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_p"
                @blur="handleBlur('main_el_max_value_p')"
                v-model="form.main_el_max_value_p"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="28"
                label="Phosphorus Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_si"
                @blur="handleBlur('precision_p', 'init')"
                v-model="form.precision_p"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Phosphorus Precision"
                class="no-input-control"
                tabindex="29"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_mo"
                @blur="handleBlur('main_el_min_value_mo')"
                v-model="form.main_el_min_value_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="30"
                label="Moly Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_mo"
                @blur="handleBlur('main_el_max_value_mo')"
                v-model="form.main_el_max_value_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="31"
                label="Moly Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_mo"
                @blur="handleBlur('precision_mo', 'init')"
                v-model="form.precision_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="32"
                label="Moly Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_b"
                @blur="handleBlur('main_el_min_value_b')"
                v-model="form.main_el_min_value_b"
                density="default"
                persistent-placeholder
                tabindex="33"
                variant="underlined"
                label="Boron Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_b"
                @blur="handleBlur('main_el_max_value_b')"
                v-model="form.main_el_max_value_b"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="34"
                label="Boron Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_b"
                @blur="handleBlur('precision_b', 'init')"
                v-model="form.precision_b"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Boron Precision"
                tabindex="35"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_nb"
                @blur="handleBlur('main_el_min_value_nb')"
                v-model="form.main_el_min_value_nb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="36"
                label="Niobium Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_nb"
                @blur="handleBlur('main_el_max_value_nb')"
                v-model="form.main_el_max_value_nb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="37"
                label="Niobium Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_nb"
                @blur="handleBlur('precision_nb', 'init')"
                v-model="form.precision_nb"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Niobium Precision"
                tabindex="38"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_v"
                @blur="handleBlur('main_el_min_value_v')"
                v-model="form.main_el_min_value_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="39"
                label="Vanadium Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_v"
                @blur="handleBlur('main_el_max_value_v')"
                v-model="form.main_el_max_value_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="40"
                label="Vanadium Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_v"
                @blur="handleBlur('precision_v', 'init')"
                v-model="form.precision_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="41"
                label="Vanadium Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_sol_al"
                @blur="handleBlur('main_el_min_value_sol_al')"
                v-model="form.main_el_min_value_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="42"
                label="SOL AL Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_sol_al"
                @blur="handleBlur('main_el_max_value_sol_al')"
                v-model="form.main_el_max_value_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="43"
                label="SOL AL Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_sol_al"
                @blur="handleBlur('precision_sol_al', 'init')"
                v-model="form.precision_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="44"
                label="SOL AL Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_mn"
                @blur="handleBlur('main_el_min_value_mn')"
                v-model="form.main_el_min_value_mn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="45"
                label="Manganese Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_mn"
                @blur="handleBlur('main_el_max_value_mn')"
                v-model="form.main_el_max_value_mn"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Manganese Max"
                tabindex="46"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_mn"
                @blur="handleBlur('precision_mn', 'init')"
                v-model="form.precision_mn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="47"
                label="Manganese Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_sp"
                @blur="handleBlur('main_el_min_value_sp')"
                v-model="form.main_el_min_value_sp"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="48"
                label="S&P Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_sp"
                @blur="handleBlur('main_el_max_value_sp')"
                v-model="form.main_el_max_value_sp"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="49"
                label="S&P Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_sp"
                @blur="handleBlur('precision_sp', 'init')"
                v-model="form.precision_sp"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="S&P Precision"
                tabindex="50"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_ni"
                @blur="handleBlur('main_el_min_value_ni')"
                v-model="form.main_el_min_value_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="51"
                label="Nickel Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_ni"
                @blur="handleBlur('main_el_max_value_ni')"
                v-model="form.main_el_max_value_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="52"
                label="Nickel Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_ni"
                @blur="handleBlur('precision_ni', 'init')"
                v-model="form.precision_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="53"
                label="Nickel Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_co"
                @blur="handleBlur('main_el_min_value_co')"
                v-model="form.main_el_min_value_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="54"
                label="Cobalt Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_co"
                @blur="handleBlur('main_el_max_value_co')"
                v-model="form.main_el_max_value_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="55"
                label="Cobalt Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_co"
                @blur="handleBlur('precision_co', 'init')"
                v-model="form.precision_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="56"
                label="Cobalt Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_sn"
                @blur="handleBlur('main_el_min_value_sn')"
                v-model="form.main_el_min_value_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="57"
                label="Tin Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_sn"
                @blur="handleBlur('main_el_max_value_sn')"
                v-model="form.main_el_max_value_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="58"
                label="Tin Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_sn"
                @blur="handleBlur('precision_sn', 'init')"
                v-model="form.precision_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Tin Precision"
                tabindex="59"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_n"
                @blur="handleBlur('main_el_min_value_n')"
                v-model="form.main_el_min_value_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="60"
                label="Nitrogen Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_n"
                @blur="handleBlur('main_el_max_value_n')"
                v-model="form.main_el_max_value_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="61"
                label="Nitrogen Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_n"
                @blur="handleBlur('precision_n', 'init')"
                v-model="form.precision_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="62"
                label="Nitrogen Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_h"
                @blur="handleBlur('main_el_min_value_h')"
                v-model="form.main_el_min_value_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="63"
                label="Hydrogen Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_h"
                @blur="handleBlur('main_el_max_value_h')"
                v-model="form.main_el_max_value_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="64"
                label="Hydrogen Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_h"
                @blur="handleBlur('precision_h', 'init')"
                v-model="form.precision_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="65"
                label="Hydrogen Precision"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <div>
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">Other Elements</div>
          </v-col>
          <v-col class="text-end">
            <v-btn
                class="text-none ml-4 mr-4"
                color="primary"
                variant="flat"
                :disabled="!save"
                @click="handleEdit(undefined)"
            >
              Add
            </v-btn>
          </v-col>
        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-server
              fixed-header
              show-current-page
              height="300"
              density="compact"
              items-per-page="10"
              :page="queryParams.page"
              :headers="tableHeaders"
              :items="tableList"
              :items-length="total"
              :loading="loading"
              item-value="id"
              @update:options="handleTableChange"
          >
            <template v-slot:item.action="{ item }">
              <v-btn
                  variant="text"
                  icon="mdi-pencil"
                  size="small"
                  :disabled="disabled"
                  @click="handleEdit(item)"
              />
              <v-dialog
                  max-width="400"
                  persistent
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                      variant="text"
                      icon="mdi-delete"
                      size="small"
                      :disabled="disabled"
                      v-bind="activatorProps"
                  />
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card
                      prepend-icon="mdi-help-circle-outline"
                      text="Deletion is irreversible"
                      title="Confirm to delete data?"
                  >
                    <template v-slot:actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          class="text-none"
                          color="#e3e3e3"
                          variant="flat"
                          @click="isActive.value = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          class="text-none"
                          color="primary"
                          variant="flat"
                          @click="handleDelete(isActive, item)"
                      >
                        Confirm
                      </v-btn>
                    </template>
                  </v-card>
                </template>
              </v-dialog>
            </template>
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
            </template>
          </v-data-table-server>
        </v-card>
        <EditForm ref="editFormRef" @change="handleFormChange" />
      </div>

    </v-form>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {useRoute, useRouter} from "vue-router";
// import OtherCode from "@/components/otherCode/index.vue";
import OtherElement from "@/components/QualityOther/index.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import QualityCode from "@/components/picker/QualityCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "./api";
// import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import EditForm from "./components/editForm.vue";

const route = useRoute();
const router = useRouter();

const tableHeaders = ref([
  {title: "Action", key: "action", width: 120, fixed: true, sortable: false, align:"center"},
  {title: "Code", key: "code"},
  {title: "Min", key: "min_value"},
  {title: "Max", key: "max_value"},
  {title: "Precision", key: "precision"},
  {title: "Element_Abbr", key: "element_abbr"},
]);
const tableList = ref([]);
const total = ref(0);

const commonStore = useCommonStore();
const loading = ref(false);
const save = ref(true);
const data = reactive({
  form: {
    id: undefined,
    quality_element_id: undefined,
    quality_id: undefined,
    s_code: undefined,
    type: "Main",
    is_active: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    main_el_min_value_c: undefined,
    main_el_max_value_c: undefined,
    precision_c: undefined,
    main_el_min_value_s: undefined,
    main_el_max_value_s: undefined,
    precision_s: undefined,
    main_el_min_value_cr: undefined,
    main_el_max_value_cr: undefined,
    precision_cr: undefined,
    main_el_min_value_al: undefined,
    main_el_max_value_al: undefined,
    precision_al: undefined,
    main_el_min_value_cu: undefined,
    main_el_max_value_cu: undefined,
    precision_cu: undefined,
    main_el_min_value_ti: undefined,
    main_el_max_value_ti: undefined,
    precision_ti: undefined,
    main_el_min_value_ca: undefined,
    main_el_max_value_ca: undefined,
    precision_ca: undefined,
    main_el_min_value_si: undefined,
    main_el_max_value_si: undefined,
    precision_si: undefined,
    main_el_min_value_p: undefined,
    main_el_max_value_p: undefined,
    precision_p: undefined,
    main_el_min_value_mo: undefined,
    main_el_max_value_mo: undefined,
    precision_mo: undefined,
    main_el_min_value_b: undefined,
    main_el_max_value_b: undefined,
    precision_b: undefined,
    main_el_min_value_nb: undefined,
    main_el_max_value_nb: undefined,
    precision_nb: undefined,
    main_el_min_value_v: undefined,
    main_el_max_value_v: undefined,
    precision_v: undefined,
    main_el_min_value_sol_al: undefined,
    main_el_max_value_sol_al: undefined,
    precision_sol_al: undefined,
    main_el_min_value_mn: undefined,
    main_el_max_value_mn: undefined,
    precision_mn: undefined,
    main_el_min_value_sp: undefined,
    main_el_max_value_sp: undefined,
    precision_sp: undefined,
    main_el_min_value_ni: undefined,
    main_el_max_value_ni: undefined,
    precision_ni: undefined,
    main_el_min_value_co: undefined,
    main_el_max_value_co: undefined,
    precision_co: undefined,
    main_el_min_value_sn: undefined,
    main_el_max_value_sn: undefined,
    precision_sn: undefined,
    main_el_min_value_n: undefined,
    main_el_max_value_n: undefined,
    precision_n: undefined,
    main_el_min_value_h: undefined,
    main_el_max_value_h: undefined,
    precision_h: undefined,
    code_1: undefined,
    other_el_min_value_1: undefined,
    other_el_max_value_1: undefined,
    quality_other_element: [],
  },
  rules: {
    quality_id: [
      value => {
        if (value) return true
        return 'Quality Code is required.'
      }
    ],
    thick_from: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness From is required.'
      },
      value => {
        if (form.value.thick_to && greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      },
      value => {
        if (value && form.value.thick_to && value === form.value.thick_to) {
          return 'thickness from cannot be equal thickness to'
        }
        return true
      },
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (form.value.thick_from && greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      },
      value => {
        if (value && form.value.thick_from && value === form.value.thick_from) {
          return 'thickness to cannot be equal thickness from'
        }
        return true
      },
    ],
  },
  queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
});

const {form, rules, queryParams} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  params["quality_other_element"] = tableList.value

  try {
    await API.add(params);
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      duration: 2000,
      onClose: () => router.back()
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

const handleBlur = (field, type = "double") => {
  let value = form.value[field];
  if (!value&& value!== 0) {
    form.value[field] = undefined;
  } else {
    form.value[field] = type === "double" ? parseFloat(value).toFixed(2) : parseInt(value, 10);
  }
}

const getDetailById = (id) => {
  API.getDetail(id).then(res => {
    const {status, data} = res;
    if (status === 200) {
      form.value = {
        ...(data || {})
      };
      tableList.value = data.quality_other_element || [];
      
    } else {
      form.value.spec = commonStore.spec;
      form.value.spec_id = commonStore.spec.id;
    }
  });
}

const handleEdit = (data) => {
  proxy.$refs["editFormRef"].handleShow(data);
}

const handleFormChange = (newItem) => {
  const index = tableList.value.findIndex(item => item.code === newItem.code);
  if (index !== -1) {
    // 如果找到相同的 code，则更新该项目
    tableList.value[index] = newItem;
  } else {
    // 如果没有找到相同的 code，则将新项目添加到 tableList 中
    tableList.value.push(newItem);
  }
};


const handleDelete = (isActive, row) => {
  if (isActive) {
    tableList.value = tableList.value.filter((item) => item.code !== row.code);
  }
};

// 进入页面根据ID获取数据详情
if (route.query.id) {
  save.value = false;
  getDetailById(route.query.id)
}

</script>
<style lang="scss" scoped>
.panel {
  &-action {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
