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
          <v-col cols="3">
            <spec-code
                v-model="form.spec_id"
                :hide-details="false"
                :spec="form.spec"
                :store="false"
                :rules="rules.spec_code"
                tabindex="1"
                :disabled="!!form.id"
            />
          </v-col>
          <v-col cols="3">
            <mill-code v-model="form.mill_id" :hide-details="false" tabindex="2" :disabled="!save"/>
          </v-col>
          <v-col cols="3">
            <v-text-field
                type="number"
                v-model="form.thick_from"
                :rules="rules.thick_from"
                class="no-input-control"
                variant="underlined"
                persistent-placeholder
                label="Thickness From"
                tabindex="3"
                @blur="handleBlur('thick_from')"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
                type="number"
                v-model="form.thick_to"
                :rules="rules.thick_to"
                class="no-input-control"
                persistent-placeholder
                variant="underlined"
                tabindex="4"
                label="Thickness To"
                @blur="handleBlur('thick_to')"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <dict-code
                v-model="form.location"
                label="Location"
                code="spec_location"
                :disabled="!save"
                persistent-placeholder
            />
          </v-col>
        </v-row>
      </div>
      <div class="mb-4 border rounded pa-4">
        <v-row align="center">
          <v-col cols="2">
            <v-text-field
                type="number"
                v-model="form.main_el_min_val_c"
                :rules="rules.main_el_min_val_c"
                @blur="handleBlur('main_el_min_val_c')"
                persistent-placeholder
                density="default"
                variant="underlined"
                label="C Min"
                bg-color="white"
                tabindex="6"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_c"
                @blur="handleBlur('main_el_max_val_c')"
                v-model="form.main_el_max_val_c"
                persistent-placeholder
                density="default"
                variant="underlined"
                label="C Max"
                bg-color="white"
                tabindex="7"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_c"
                @blur="handleBlur('precision_c', 'init')"
                v-model="form.precision_c"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="C Prec."
                bg-color="white"
                tabindex="8"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_si"
                @blur="handleBlur('main_el_min_val_si')"
                v-model="form.main_el_min_val_si"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="9"
                label="Si Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_si"
                @blur="handleBlur('main_el_max_val_si')"
                v-model="form.main_el_max_val_si"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="10"
                label="Si Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_si"
                @blur="handleBlur('precision_si', 'init')"
                v-model="form.precision_si"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Si Prec."
                class="no-input-control"
                tabindex="11"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_mn"
                @blur="handleBlur('main_el_min_val_mn')"
                v-model="form.main_el_min_val_mn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="12"
                label="Mn Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_mn"
                @blur="handleBlur('main_el_max_val_mn')"
                v-model="form.main_el_max_val_mn"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Mn Max"
                tabindex="13"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_mn"
                @blur="handleBlur('precision_mn', 'init')"
                v-model="form.precision_mn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="14"
                label="Mn Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_p"
                @blur="handleBlur('main_el_min_val_p')"
                v-model="form.main_el_min_val_p"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="15"
                label="P Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_p"
                @blur="handleBlur('main_el_max_val_p')"
                v-model="form.main_el_max_val_p"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="P Max"
                tabindex="16"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_p"
                @blur="handleBlur('precision_p', 'init')"
                v-model="form.precision_p"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="17"
                label="P Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_s"
                @blur="handleBlur('main_el_min_val_s')"
                v-model="form.main_el_min_val_s"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="S Min"
                bg-color="white"
                tabindex="18"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_s"
                @blur="handleBlur('main_el_max_val_s')"
                v-model="form.main_el_max_val_s"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="S Max"
                bg-color="white"
                tabindex="19"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_s"
                @blur="handleBlur('precision_s', 'init')"
                v-model="form.precision_s"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="S Prec."
                class="no-input-control"
                bg-color="white"
                tabindex="20"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_sp"
                @blur="handleBlur('main_el_min_val_sp')"
                v-model="form.main_el_min_val_sp"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="21"
                label="S&P Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_sp"
                @blur="handleBlur('main_el_max_val_sp')"
                v-model="form.main_el_max_val_sp"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="22"
                label="S&P Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_sp"
                @blur="handleBlur('precision_sp', 'init')"
                v-model="form.precision_sp"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="S&P Prec."
                tabindex="23"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_cr"
                @blur="handleBlur('main_el_min_val_cr')"
                v-model="form.main_el_min_val_cr"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Cr Min"
                bg-color="white"
                tabindex="24"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_cr"
                @blur="handleBlur('main_el_max_val_cr')"
                v-model="form.main_el_max_val_cr"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Cr Max"
                tabindex="25"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_cr"
                @blur="handleBlur('precision_cr', 'init')"
                v-model="form.precision_cr"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Cr Prec."
                class="no-input-control"
                tabindex="26"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_mo"
                @blur="handleBlur('main_el_min_val_mo')"
                v-model="form.main_el_min_val_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="27"
                label="Mo Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_mo"
                @blur="handleBlur('main_el_max_val_mo')"
                v-model="form.main_el_max_val_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="28"
                label="Mo Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_mo"
                @blur="handleBlur('precision_mo', 'init')"
                v-model="form.precision_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="29"
                label="Mo Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_ni"
                @blur="handleBlur('main_el_min_val_ni')"
                v-model="form.main_el_min_val_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="30"
                label="Ni Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_ni"
                @blur="handleBlur('main_el_max_val_ni')"
                v-model="form.main_el_max_val_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="31"
                label="Ni Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_ni"
                @blur="handleBlur('precision_ni', 'init')"
                v-model="form.precision_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="32"
                label="Ni Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_al"
                @blur="handleBlur('main_el_min_val_al')"
                v-model="form.main_el_min_val_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Al Min"
                tabindex="33"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_al"
                @blur="handleBlur('main_el_max_val_al')"
                v-model="form.main_el_max_val_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Al Max"
                tabindex="34"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_al"
                @blur="handleBlur('precision_al', 'init')"
                v-model="form.precision_al"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Al Prec."
                class="no-input-control"
                tabindex="35"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_b"
                @blur="handleBlur('main_el_min_val_b')"
                v-model="form.main_el_min_val_b"
                density="default"
                persistent-placeholder
                tabindex="36"
                variant="underlined"
                label="B Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_b"
                @blur="handleBlur('main_el_max_val_b')"
                v-model="form.main_el_max_val_b"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="37"
                label="B Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_b"
                @blur="handleBlur('precision_b', 'init')"
                v-model="form.precision_b"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="B Prec."
                tabindex="38"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_co"
                @blur="handleBlur('main_el_min_val_co')"
                v-model="form.main_el_min_val_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="39"
                label="Co Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_co"
                @blur="handleBlur('main_el_max_val_co')"
                v-model="form.main_el_max_val_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="40"
                label="Co Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_co"
                @blur="handleBlur('precision_co', 'init')"
                v-model="form.precision_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="41"
                label="Co Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_cu"
                @blur="handleBlur('main_el_min_val_cu')"
                v-model="form.main_el_min_val_cu"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Cu Min"
                tabindex="42"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_cu"
                @blur="handleBlur('main_el_max_val_cu')"
                v-model="form.main_el_max_val_cu"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Cu Max"
                tabindex="43"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_cu"
                @blur="handleBlur('precision_cu', 'init')"
                v-model="form.precision_cu"
                density="default"
                variant="underlined"
                label="Cu Prec."
                class="no-input-control"
                persistent-placeholder
                tabindex="44"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_nb"
                @blur="handleBlur('main_el_min_val_nb')"
                v-model="form.main_el_min_val_nb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="45"
                label="Nb Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_nb"
                @blur="handleBlur('main_el_max_val_nb')"
                v-model="form.main_el_max_val_nb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="46"
                label="Nb Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_nb"
                @blur="handleBlur('precision_nb', 'init')"
                v-model="form.precision_nb"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Nb Prec."
                tabindex="47"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_sn"
                @blur="handleBlur('main_el_min_val_sn')"
                v-model="form.main_el_min_val_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="48"
                label="Sn Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_sn"
                @blur="handleBlur('main_el_max_val_sn')"
                v-model="form.main_el_max_val_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="49"
                label="Sn Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_sn"
                @blur="handleBlur('precision_sn', 'init')"
                v-model="form.precision_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Sn Prec."
                tabindex="50"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_ti"
                @blur="handleBlur('main_el_min_val_ti')"
                v-model="form.main_el_min_val_ti"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Ti Min"
                tabindex="51"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_ti"
                @blur="handleBlur('main_el_max_val_ti')"
                v-model="form.main_el_max_val_ti"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Ti Max"
                tabindex="52"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_ti"
                @blur="handleBlur('precision_ti', 'init')"
                v-model="form.precision_ti"
                density="default"
                variant="underlined"
                label="Ti Prec."
                persistent-placeholder
                tabindex="53"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_v"
                @blur="handleBlur('main_el_min_val_v')"
                v-model="form.main_el_min_val_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="54"
                label="V Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_v"
                @blur="handleBlur('main_el_max_val_v')"
                v-model="form.main_el_max_val_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="55"
                label="V Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_v"
                @blur="handleBlur('precision_v', 'init')"
                v-model="form.precision_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="56"
                label="V Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_n"
                @blur="handleBlur('main_el_min_val_n')"
                v-model="form.main_el_min_val_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="57"
                label="N Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_n"
                @blur="handleBlur('main_el_max_val_n')"
                v-model="form.main_el_max_val_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="58"
                label="N Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_n"
                @blur="handleBlur('precision_n', 'init')"
                v-model="form.precision_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="59"
                label="N Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_ca"
                @blur="handleBlur('main_el_min_val_ca')"
                v-model="form.main_el_min_val_ca"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="60"
                label="Ca Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_ca"
                @blur="handleBlur('main_el_max_val_ca')"
                v-model="form.main_el_max_val_ca"
                density="default"
                variant="underlined"
                persistent-placeholder
                tabindex="61"
                label="Ca Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_ca"
                @blur="handleBlur('precision_ca', 'init')"
                v-model="form.precision_ca"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="Ca Prec."
                tabindex="62"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_sol_al"
                @blur="handleBlur('main_el_min_val_sol_al')"
                v-model="form.main_el_min_val_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="63"
                label="SOL AL Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_sol_al"
                @blur="handleBlur('main_el_max_val_sol_al')"
                v-model="form.main_el_max_val_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="64"
                label="SOL AL Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_sol_al"
                @blur="handleBlur('precision_sol_al', 'init')"
                v-model="form.precision_sol_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="65"
                label="SOL AL Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_h"
                @blur="handleBlur('main_el_min_val_h')"
                v-model="form.main_el_min_val_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="66"
                label="H Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_h"
                @blur="handleBlur('main_el_max_val_h')"
                v-model="form.main_el_max_val_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="67"
                label="H Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_h"
                @blur="handleBlur('precision_h', 'init')"
                v-model="form.precision_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="68"
                label="H Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_as"
                @blur="handleBlur('main_el_min_val_as')"
                v-model="form.main_el_min_val_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="69"
                label="AS Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_as"
                @blur="handleBlur('main_el_max_val_as')"
                v-model="form.main_el_max_val_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="70"
                label="AS Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_as"
                @blur="handleBlur('precision_as', 'init')"
                v-model="form.precision_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="71"
                label="AS Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_bi"
                @blur="handleBlur('main_el_min_val_bi')"
                v-model="form.main_el_min_val_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="72"
                label="Bi Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_bi"
                @blur="handleBlur('main_el_max_val_bi')"
                v-model="form.main_el_max_val_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="73"
                label="Bi Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_bi"
                @blur="handleBlur('precision_bi', 'init')"
                v-model="form.precision_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="74"
                label="Bi Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_ce"
                @blur="handleBlur('main_el_min_val_ce')"
                v-model="form.main_el_min_val_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="75"
                label="Ce Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_ce"
                @blur="handleBlur('main_el_max_val_ce')"
                v-model="form.main_el_max_val_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="76"
                label="Ce Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_ce"
                @blur="handleBlur('precision_ce', 'init')"
                v-model="form.precision_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="77"
                label="Ce Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_o"
                @blur="handleBlur('main_el_min_val_o')"
                v-model="form.main_el_min_val_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="78"
                label="O Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_o"
                @blur="handleBlur('main_el_max_val_o')"
                v-model="form.main_el_max_val_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="79"
                label="O Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_o"
                @blur="handleBlur('precision_o', 'init')"
                v-model="form.precision_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="80"
                label="O Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_pb"
                @blur="handleBlur('main_el_min_val_pb')"
                v-model="form.main_el_min_val_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="81"
                label="Pb Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_pb"
                @blur="handleBlur('main_el_max_val_pb')"
                v-model="form.main_el_max_val_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="82"
                label="Pb Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_pb"
                @blur="handleBlur('precision_pb', 'init')"
                v-model="form.precision_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="83"
                label="Pb Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_sb"
                @blur="handleBlur('main_el_min_val_sb')"
                v-model="form.main_el_min_val_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="84"
                label="Sb Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_sb"
                @blur="handleBlur('main_el_max_val_sb')"
                v-model="form.main_el_max_val_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="85"
                label="Sb Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_sb"
                @blur="handleBlur('precision_sb', 'init')"
                v-model="form.precision_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="86"
                label="Sb Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_w"
                @blur="handleBlur('main_el_min_val_w')"
                v-model="form.main_el_min_val_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="87"
                label="W Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_w"
                @blur="handleBlur('main_el_max_val_w')"
                v-model="form.main_el_max_val_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="88"
                label="W Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_w"
                @blur="handleBlur('precision_w', 'init')"
                v-model="form.precision_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="89"
                label="W Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_zn"
                @blur="handleBlur('main_el_min_val_zn')"
                v-model="form.main_el_min_val_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="90"
                label="Zn Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_zn"
                @blur="handleBlur('main_el_max_val_zn')"
                v-model="form.main_el_max_val_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="91"
                label="Zn Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_zn"
                @blur="handleBlur('precision_zn', 'init')"
                v-model="form.precision_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="92"
                label="Zn Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_zr"
                @blur="handleBlur('main_el_min_val_zr')"
                v-model="form.main_el_min_val_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="93"
                label="Zr Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_zr"
                @blur="handleBlur('main_el_max_val_zr')"
                v-model="form.main_el_max_val_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="94"
                label="Zr Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_zr"
                @blur="handleBlur('precision_zr', 'init')"
                v-model="form.precision_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="95"
                label="Zr Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_te"
                @blur="handleBlur('main_el_min_val_te')"
                v-model="form.main_el_min_val_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="96"
                label="Te Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_te"
                @blur="handleBlur('main_el_max_val_te')"
                v-model="form.main_el_max_val_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="97"
                label="Te Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_te"
                @blur="handleBlur('precision_te', 'init')"
                v-model="form.precision_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="98"
                label="Te Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_rad"
                @blur="handleBlur('main_el_min_val_rad')"
                v-model="form.main_el_min_val_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="99"
                label="Rad Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_rad"
                @blur="handleBlur('main_el_max_val_rad')"
                v-model="form.main_el_max_val_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="100"
                label="Rad Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_rad"
                @blur="handleBlur('precision_rad', 'init')"
                v-model="form.precision_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="101"
                label="Rad Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_insal"
                @blur="handleBlur('main_el_min_val_insal')"
                v-model="form.main_el_min_val_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="102"
                label="Insal Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_insal"
                @blur="handleBlur('main_el_max_val_insal')"
                v-model="form.main_el_max_val_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="103"
                label="Insal Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_insal"
                @blur="handleBlur('precision_insal', 'init')"
                v-model="form.precision_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="104"
                label="Insal Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_min_val_n2"
                @blur="handleBlur('main_el_min_val_n2')"
                v-model="form.main_el_min_val_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="105"
                label="N2 Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.main_el_max_val_n2"
                @blur="handleBlur('main_el_max_val_n2')"
                v-model="form.main_el_max_val_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="106"
                label="N2 Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                :rules="rules.precision_n2"
                @blur="handleBlur('precision_n2', 'init')"
                v-model="form.precision_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="107"
                label="N2 Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="mb-4 border rounded pa-4">
        <other-code ref="otherCode" :id="form.id" type="spprodan" :disabled="!save"/>
      </div>
    </v-form>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {toast} from "vue3-toastify";
import {useRoute, useRouter} from "vue-router";
import OtherCode from "@/components/otherCode/index.vue";
import SpecCode from "@/components/picker/SpecCode.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero, floatToFixed} from "@/util/util";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import API from "./api";

const route = useRoute();
const router = useRouter();

const commonStore = useCommonStore();
const loading = ref(false);
const save = ref(true);
const data = reactive({
  form: {
    id: undefined,
    spec_id: commonStore.spec_id,
    spec: commonStore.sepc,
    s_code: undefined,
    cev_min: undefined,
    cev_max: undefined,
    cev_value: undefined,
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    main_el_min_val_c: undefined,
    main_el_max_val_c: undefined,
    precision_c: undefined,
    main_el_min_val_p: undefined,
    main_el_max_val_p: undefined,
    precision_p: undefined,
    main_el_min_val_s: undefined,
    main_el_max_val_s: undefined,
    precision_s: undefined,
    main_el_min_val_cr: undefined,
    main_el_max_val_cr: undefined,
    precision_cr: undefined,
    main_el_min_val_al: undefined,
    main_el_max_val_al: undefined,
    precision_al: undefined,
    main_el_min_val_cu: undefined,
    main_el_max_val_cu: undefined,
    precision_cu: undefined,
    main_el_min_val_ti: undefined,
    main_el_max_val_ti: undefined,
    precision_ti: undefined,
    main_el_min_val_ca: undefined,
    main_el_max_val_ca: undefined,
    precision_ca: undefined,
    main_el_min_val_si: undefined,
    main_el_max_val_si: undefined,
    precision_si: undefined,
    main_el_min_val_mo: undefined,
    main_el_max_val_mo: undefined,
    precision_mo: undefined,
    main_el_min_val_b: undefined,
    main_el_max_val_b: undefined,
    precision_b: undefined,
    main_el_min_val_nb: undefined,
    main_el_max_val_nb: undefined,
    precision_nb: undefined,
    main_el_min_val_v: undefined,
    main_el_max_val_v: undefined,
    precision_v: undefined,
    main_el_min_val_sol_al: undefined,
    main_el_max_val_sol_al: undefined,
    precision_sol_al: undefined,
    main_el_min_val_mn: undefined,
    main_el_max_val_mn: undefined,
    precision_mn: undefined,
    main_el_min_val_sp: undefined,
    main_el_max_val_sp: undefined,
    precision_sp: undefined,
    main_el_min_val_ni: undefined,
    main_el_max_val_ni: undefined,
    precision_ni: undefined,
    main_el_min_val_co: undefined,
    main_el_max_val_co: undefined,
    precision_co: undefined,
    main_el_min_val_sn: undefined,
    main_el_max_val_sn: undefined,
    precision_sn: undefined,
    main_el_min_val_n: undefined,
    main_el_max_val_n: undefined,
    precision_n: undefined,
    main_el_min_val_h: undefined,
    main_el_max_val_h: undefined,
    precision_h: undefined,


    main_el_min_val_as: undefined,
    main_el_max_val_as: undefined,
    precision_as: undefined,
    main_el_min_val_bi: undefined,
    main_el_max_val_bi: undefined,
    precision_bi: undefined,
    main_el_min_val_ce: undefined,
    main_el_max_val_ce: undefined,
    precision_ce: undefined,
    main_el_min_val_o: undefined,
    main_el_max_val_o: undefined,
    precision_o: undefined,
    main_el_min_val_pb: undefined,
    main_el_max_val_pb: undefined,
    precision_pb: undefined,
    main_el_min_val_sb: undefined,
    main_el_max_val_sb: undefined,
    precision_sb: undefined,
    main_el_min_val_w: undefined,
    main_el_max_val_w: undefined,
    precision_w: undefined,
    main_el_min_val_zn: undefined,
    main_el_max_val_zn: undefined,
    precision_zn: undefined,
    main_el_min_val_zr: undefined,
    main_el_max_val_zr: undefined,
    precision_zr: undefined,
    main_el_min_val_te: undefined,
    main_el_max_val_te: undefined,
    precision_te: undefined,
    main_el_min_val_rad: undefined,
    main_el_max_val_rad: undefined,
    precision_rad: undefined,
    main_el_min_val_insal: undefined,
    main_el_max_val_insal: undefined,
    precision_insal: undefined,
    main_el_min_val_n2: undefined,
    main_el_max_val_n2: undefined,
    precision_n2: undefined,

    code_1: undefined,
    other_el_min_val_1: undefined,
    other_el_max_val_1: undefined,
    other_element: [],
  },
  rules: {
    spec_code: [
      value => {
        if (value) return true
        return 'Spec Code is required.'
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
  chemical_list : ['c', 'si','mn', 'p','s', 'cr','mo', 'ni', 'al', 'b', 'co', 'cu', 'nb','sn', 'ti', 'v', 'ca', 'n', 'h','sal','sp', 'as', 'bi', 'ce', 'o', 'pb','sb', 'w', 'zn', 'zr', 'te', 'rad', 'insal', 'n2']

});

const {form, rules, chemical_list} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (!params.id) {
    params["other_element"] = proxy.$refs["otherCode"].getValue();
    delete params.spec;
  }
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
  if (!value) {
    form.value[field] = undefined;
  } else {
    form.value[field] = type === "double" ? parseFloat(value).toFixed(2) : parseInt(value, 10);
  }
}

const getDetailById = (id) => {
  API.getDetail(id).then(res => {
    const {status, data} = res;
    if (status === 200) {
      // 根据precision 设置 min 和max 保留的小数位
      chemical_list.value.forEach((item, index) => {
        if (data[`precision_${item}`] && data[`precision_${item}`]!=0) {
          data[`main_el_min_val_${item}`] = floatToFixed(data[`main_el_min_val_${item}`],data[`precision_${item}`])
          data[`main_el_max_val_${item}`] = floatToFixed(data[`main_el_max_val_${item}`],data[`precision_${item}`])
        }
      })
      form.value = data || {};
    } else {
      form.value.spec = commonStore.spec;
      form.value.spec_id = commonStore.spec.id;
    }
  });
}

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
