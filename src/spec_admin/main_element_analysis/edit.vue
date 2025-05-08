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
          <v-col cols="2">
            <mill-code v-model="form.mill_id" :hide-details="false" tabindex="2" :disabled="!save"/>
          </v-col>
          <v-col cols="2">
            <dict-code
                v-model="form.type"
                label="Type"
                code="main_element_type"
                :disabled="!save"
                tabindex="3"
                :hide-details="false"
                persistent-placeholder
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
                type="number"
                v-model.number="form.thick_from"
                :rules="rules.thick_from"
                class="no-input-control"
                variant="underlined"
                persistent-placeholder
                label="Thickness From"
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
                label="Thickness To"
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
                label="C Min"
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
                label="C Max"
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
                label="C Prec."
                bg-color="white"
                tabindex="8"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_c"
                v-model="form.uom_c"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="C Uom"
                bg-color="white"
                tabindex="9"
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
                tabindex="10"
                label="Si Min"
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
                tabindex="11"
                label="Si Max"
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
                label="Si Prec."
                class="no-input-control"
                tabindex="12"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_si"
                v-model="form.uom_si"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Si Uom"
                bg-color="white"
                tabindex="13"
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
                tabindex="14"
                label="Mn Min"
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
                label="Mn Max"
                tabindex="15"
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
                tabindex="16"
                label="Mn Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_mn"
                v-model="form.uom_mn"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Mn Uom"
                bg-color="white"
                tabindex="17"
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
                label="P Min"
                bg-color="white"
                tabindex="18"
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
                variant="underlined"
                persistent-placeholder
                label="P Max"
                bg-color="white"
                tabindex="19"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_p"
                @blur="handleBlur('precision_p', 'init')"
                v-model="form.precision_p"
                density="default"
                variant="underlined"
                persistent-placeholder
                label="P Prec."
                class="no-input-control"
                bg-color="white"
                tabindex="20"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_p"
                v-model="form.uom_p"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="P Uom"
                bg-color="white"
                tabindex="21"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>

          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_s"
                @blur="handleBlur('main_el_min_value_s')"
                v-model="form.main_el_min_value_s"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="S Min"
                bg-color="white"
                tabindex="22"
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
                label="S Max"
                bg-color="white"
                tabindex="23"
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
                label="S Prec."
                class="no-input-control"
                bg-color="white"
                tabindex="24"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_s"
                v-model="form.uom_s"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="S Uom"
                bg-color="white"
                tabindex="25"
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
                label="Cr Min"
                bg-color="white"
                tabindex="30"
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
                label="Cr Max"
                tabindex="31"
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
                label="Cr Prec."
                class="no-input-control"
                tabindex="32"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_cr"
                v-model="form.uom_cr"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Cr Uom"
                bg-color="white"
                tabindex="33"
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
                tabindex="34"
                label="Mo Min"
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
                tabindex="35"
                label="Mo Max"
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
                tabindex="36"
                label="Mo Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_mo"
                v-model="form.uom_mo"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Mo Uom"
                bg-color="white"
                tabindex="37"
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
                tabindex="38"
                label="Ni Min"
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
                tabindex="39"
                label="Ni Max"
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
                tabindex="40"
                label="Ni Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_ni"
                v-model="form.uom_ni"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Ni Uom"
                bg-color="white"
                tabindex="41"
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
                label="Al Min"
                tabindex="42"
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
                label="Al Max"
                tabindex="43"
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
                label="Al Prec."
                class="no-input-control"
                tabindex="44"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_al"
                v-model="form.uom_al"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Al Uom"
                bg-color="white"
                tabindex="45"
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
                tabindex="46"
                variant="underlined"
                label="B Min"
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
                tabindex="47"
                label="B Max"
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
                label="B Prec."
                tabindex="48"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_b"
                v-model="form.uom_b"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="B Uom"
                bg-color="white"
                tabindex="49"
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
                tabindex="50"
                label="Co Min"
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
                tabindex="51"
                label="Co Max"
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
                tabindex="52"
                label="Co Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_co"
                v-model="form.uom_co"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Co Uom"
                bg-color="white"
                tabindex="53"
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
                label="Cu Min"
                tabindex="54"
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
                label="Cu Max"
                tabindex="55"
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
                label="Cu Prec."
                class="no-input-control"
                persistent-placeholder
                tabindex="56"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_cu"
                v-model="form.uom_cu"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Cu Uom"
                bg-color="white"
                tabindex="57"
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
                tabindex="58"
                label="Nb Min"
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
                tabindex="59"
                label="Nb Max"
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
                label="Nb Prec."
                tabindex="60"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_nb"
                v-model="form.uom_nb"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Nb Uom"
                bg-color="white"
                tabindex="61"
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
                tabindex="62"
                label="Sn Min"
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
                tabindex="63"
                label="Sn Max"
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
                label="Sn Prec."
                tabindex="64"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_sn"
                v-model="form.uom_sn"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Sn Uom"
                bg-color="white"
                tabindex="65"
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
                label="Ti Min"
                tabindex="66"
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
                label="Ti Max"
                tabindex="67"
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
                label="Ti Prec."
                persistent-placeholder
                tabindex="68"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_ti"
                v-model="form.uom_ti"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Ti Uom"
                bg-color="white"
                tabindex="69"
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
                tabindex="70"
                label="V Min"
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
                tabindex="71"
                label="V Max"
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
                tabindex="72"
                label="V Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_v"
                v-model="form.uom_v"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="V Uom"
                bg-color="white"
                tabindex="73"
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
                tabindex="74"
                label="N Min"
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
                tabindex="75"
                label="N Max"
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
                tabindex="76"
                label="N Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_n"
                v-model="form.uom_n"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="N Uom"
                bg-color="white"
                tabindex="77"
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
                tabindex="78"
                label="Ca Min"
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
                tabindex="79"
                label="Ca Max"
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
                label="Ca Prec."
                tabindex="80"
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_ca"
                v-model="form.uom_ca"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Ca Uom"
                bg-color="white"
                tabindex="81"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_sal"
                @blur="handleBlur('main_el_min_value_sal')"
                v-model="form.main_el_min_value_sal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="82"
                label="SOL AL Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_sal"
                @blur="handleBlur('main_el_max_value_sal')"
                v-model="form.main_el_max_value_sal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="83"
                label="SOL AL Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_sal"
                @blur="handleBlur('precision_sal', 'init')"
                v-model="form.precision_sal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="84"
                label="SOL AL Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_sal"
                v-model="form.uom_sal"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="SOL AL Uom"
                bg-color="white"
                tabindex="85"
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
                tabindex="86"
                label="H Min"
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
                tabindex="87"
                label="H Max"
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
                tabindex="88"
                label="H Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_h"
                v-model="form.uom_h"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="H Uom"
                bg-color="white"
                tabindex="89"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>


          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_as"
                @blur="handleBlur('main_el_min_value_as')"
                v-model="form.main_el_min_value_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="90"
                label="AS Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_as"
                @blur="handleBlur('main_el_max_value_as')"
                v-model="form.main_el_max_value_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="91"
                label="AS Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_as"
                @blur="handleBlur('precision_as', 'init')"
                v-model="form.precision_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="92"
                label="AS Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_as"
                v-model="form.uom_as"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="AS Uom"
                bg-color="white"
                tabindex="93"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_bi"
                @blur="handleBlur('main_el_min_value_bi')"
                v-model="form.main_el_min_value_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="94"
                label="Bi Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_bi"
                @blur="handleBlur('main_el_max_value_bi')"
                v-model="form.main_el_max_value_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="95"
                label="Bi Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_bi"
                @blur="handleBlur('precision_bi', 'init')"
                v-model="form.precision_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="96"
                label="Bi Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_bi"
                v-model="form.uom_bi"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Bi Uom"
                bg-color="white"
                tabindex="97"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_ce"
                @blur="handleBlur('main_el_min_value_ce')"
                v-model="form.main_el_min_value_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="98"
                label="Ce Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_ce"
                @blur="handleBlur('main_el_max_value_ce')"
                v-model="form.main_el_max_value_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="99"
                label="Ce Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_ce"
                @blur="handleBlur('precision_ce', 'init')"
                v-model="form.precision_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="100"
                label="Ce Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_ce"
                v-model="form.uom_ce"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Ce Uom"
                bg-color="white"
                tabindex="101"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_o"
                @blur="handleBlur('main_el_min_value_o')"
                v-model="form.main_el_min_value_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="102"
                label="O Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_o"
                @blur="handleBlur('main_el_max_value_o')"
                v-model="form.main_el_max_value_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="103"
                label="O Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_o"
                @blur="handleBlur('precision_o', 'init')"
                v-model="form.precision_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="104"
                label="O Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_o"
                v-model="form.uom_o"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="O Uom"
                bg-color="white"
                tabindex="105"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_pb"
                @blur="handleBlur('main_el_min_value_pb')"
                v-model="form.main_el_min_value_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="106"
                label="Pb Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_pb"
                @blur="handleBlur('main_el_max_value_pb')"
                v-model="form.main_el_max_value_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="107"
                label="Pb Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_pb"
                @blur="handleBlur('precision_pb', 'init')"
                v-model="form.precision_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="108"
                label="Pb Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_pb"
                v-model="form.uom_pb"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Pb Uom"
                bg-color="white"
                tabindex="109"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_sb"
                @blur="handleBlur('main_el_min_value_sb')"
                v-model="form.main_el_min_value_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="110"
                label="Sb Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_sb"
                @blur="handleBlur('main_el_max_value_sb')"
                v-model="form.main_el_max_value_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="111"
                label="Sb Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_sb"
                @blur="handleBlur('precision_sb', 'init')"
                v-model="form.precision_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="112"
                label="Sb Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_sb"
                v-model="form.uom_sb"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Sb Uom"
                bg-color="white"
                tabindex="113"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_w"
                @blur="handleBlur('main_el_min_value_w')"
                v-model="form.main_el_min_value_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="114"
                label="W Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_w"
                @blur="handleBlur('main_el_max_value_w')"
                v-model="form.main_el_max_value_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="115"
                label="W Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_w"
                @blur="handleBlur('precision_w', 'init')"
                v-model="form.precision_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="116"
                label="W Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_w"
                v-model="form.uom_w"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="W Uom"
                bg-color="white"
                tabindex="117"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_zn"
                @blur="handleBlur('main_el_min_value_zn')"
                v-model="form.main_el_min_value_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="118"
                label="Zn Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_zn"
                @blur="handleBlur('main_el_max_value_zn')"
                v-model="form.main_el_max_value_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="119"
                label="Zn Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_zn"
                @blur="handleBlur('precision_zn', 'init')"
                v-model="form.precision_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="120"
                label="Zn Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_zn"
                v-model="form.uom_zn"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Zn Uom"
                bg-color="white"
                tabindex="121"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_zr"
                @blur="handleBlur('main_el_min_value_zr')"
                v-model="form.main_el_min_value_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="122"
                label="Zr Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_zr"
                @blur="handleBlur('main_el_max_value_zr')"
                v-model="form.main_el_max_value_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="123"
                label="Zr Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_zr"
                @blur="handleBlur('precision_zr', 'init')"
                v-model="form.precision_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="124"
                label="Zr Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_zr"
                v-model="form.uom_zr"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Zr Uom"
                bg-color="white"
                tabindex="125"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_te"
                @blur="handleBlur('main_el_min_value_te')"
                v-model="form.main_el_min_value_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="126"
                label="Te Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_te"
                @blur="handleBlur('main_el_max_value_te')"
                v-model="form.main_el_max_value_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="127"
                label="Te Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_te"
                @blur="handleBlur('precision_te', 'init')"
                v-model="form.precision_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="128"
                label="Te Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_te"
                v-model="form.uom_te"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Te Uom"
                bg-color="white"
                tabindex="129"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_rad"
                @blur="handleBlur('main_el_min_value_rad')"
                v-model="form.main_el_min_value_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="130"
                label="Rad Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_rad"
                @blur="handleBlur('main_el_max_value_rad')"
                v-model="form.main_el_max_value_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="131"
                label="Rad Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_rad"
                @blur="handleBlur('precision_rad', 'init')"
                v-model="form.precision_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="132"
                label="Rad Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_rad"
                v-model="form.uom_rad"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Rad Uom"
                bg-color="white"
                tabindex="133"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_insal"
                @blur="handleBlur('main_el_min_value_insal')"
                v-model="form.main_el_min_value_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="134"
                label="Insal Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_insal"
                @blur="handleBlur('main_el_max_value_insal')"
                v-model="form.main_el_max_value_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="135"
                label="Insal Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_insal"
                @blur="handleBlur('precision_insal', 'init')"
                v-model="form.precision_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="136"
                label="Insal Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_insal"
                v-model="form.uom_insal"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="Insal Uom"
                bg-color="white"
                tabindex="137"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_min_value_n2"
                @blur="handleBlur('main_el_min_value_n2')"
                v-model="form.main_el_min_value_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="138"
                label="N2 Min"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.main_el_max_value_n2"
                @blur="handleBlur('main_el_max_value_n2')"
                v-model="form.main_el_max_value_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="139"
                label="N2 Max"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.precision_n2"
                @blur="handleBlur('precision_n2', 'init')"
                v-model="form.precision_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                tabindex="140"
                label="N2 Prec."
                class="no-input-control"
                bg-color="white"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-text-field
                :rules="rules.uom_n2"
                v-model="form.uom_n2"
                density="default"
                persistent-placeholder
                variant="underlined"
                label="N2 Uom"
                bg-color="white"
                tabindex="141"
                :disabled="!save"
                clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
      <div class="mb-4 border rounded pa-4">
        <other-code ref="otherCode" :id="form.id" type="spmainel" :disabled="!save" />
      </div>

      <div class="mb-4 border rounded pa-4">
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">Formula</div>
          </v-col>

        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="formula_tableHeaders"
                :items="formula_tableList"
                :loading="loading"
                item-value="id"
            ></v-data-table-virtual>
        </v-card>
      </div>

      <div class="mb-4 border rounded pa-4">
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">Al-N Trade Offs</div>
          </v-col>

        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="al_n_trade_offs_tableHeaders"
                :items="al_n_trade_offs_tableList"
                :loading="loading"
                item-value="id"
            ></v-data-table-virtual>
        </v-card>
      </div>

      <div class="mb-4 border rounded pa-4">
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">C-Mn Trade Offs</div>
          </v-col>

        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="c_mn_trade_offs_tableHeaders"
                :items="c_mn_trade_offs_tableList"
                :loading="loading"
                item-value="id"
            ></v-data-table-virtual>
        </v-card>
      </div>

      <div class="mb-4 border rounded pa-4">
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">N-P Trade off (.001 per .005P)</div>
          </v-col>

        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="n_p_trade_offs_tableHeaders"
                :items="n_p_trade_offs_tableList"
                :loading="loading"
                item-value="id"
            ></v-data-table-virtual>
        </v-card>
      </div>

      <div class="mb-4 border rounded pa-4">
        <v-row align="center" justify="space-between">
          <v-col>
            <div class="text-subtitle-1">N Binder Options</div>
          </v-col>

        </v-row>
        <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
          <v-data-table-virtual
                fixed-header
                min-height="500"
                :headers="n_binder_options_tableHeaders"
                :items="n_binder_options_tableList"
                :loading="loading"
                item-value="id"
            ></v-data-table-virtual>
        </v-card>
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
import API from "./api";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";

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
    type: "Main",
    thick_from: undefined,
    thick_to: undefined,
    location: undefined,
    main_el_min_value_c: undefined,
    main_el_max_value_c: undefined,
    precision_c: undefined,
    uom_c: undefined,
    main_el_min_value_s: undefined,
    main_el_max_value_s: undefined,
    precision_s: undefined,
    uom_s: undefined,
    main_el_min_value_p: undefined,
    main_el_max_value_p: undefined,
    precision_p: undefined,
    uom_p: undefined,
    main_el_min_value_cr: undefined,
    main_el_max_value_cr: undefined,
    precision_cr: undefined,
    uom_cr: undefined,
    main_el_min_value_al: undefined,
    main_el_max_value_al: undefined,
    precision_al: undefined,
    uom_al: undefined,
    main_el_min_value_cu: undefined,
    main_el_max_value_cu: undefined,
    precision_cu: undefined,
    uom_cu: undefined,
    main_el_min_value_ti: undefined,
    main_el_max_value_ti: undefined,
    precision_ti: undefined,
    uom_ti: undefined,
    main_el_min_value_ca: undefined,
    main_el_max_value_ca: undefined,
    precision_ca: undefined,
    uom_ca: undefined,
    main_el_min_value_si: undefined,
    main_el_max_value_si: undefined,
    precision_si: undefined,
    uom_si: undefined,
    main_el_min_value_mo: undefined,
    main_el_max_value_mo: undefined,
    precision_mo: undefined,
    uom_mo: undefined,
    main_el_min_value_b: undefined,
    main_el_max_value_b: undefined,
    precision_b: undefined,
    uom_b: undefined,
    main_el_min_value_nb: undefined,
    main_el_max_value_nb: undefined,
    precision_nb: undefined,
    uom_nb: undefined,
    main_el_min_value_v: undefined,
    main_el_max_value_v: undefined,
    precision_v: undefined,
    uom_v: undefined,
    main_el_min_value_sal: undefined,
    main_el_max_value_sal: undefined,
    precision_sal: undefined,
    uom_sal: undefined,
    main_el_min_value_mn: undefined,
    main_el_max_value_mn: undefined,
    precision_mn: undefined,
    uom_mn: undefined,
    main_el_min_value_sp: undefined,
    main_el_max_value_sp: undefined,
    precision_sp: undefined,
    uom_sp: undefined,
    main_el_min_value_ni: undefined,
    main_el_max_value_ni: undefined,
    precision_ni: undefined,
    uom_ni: undefined,
    main_el_min_value_co: undefined,
    main_el_max_value_co: undefined,
    precision_co: undefined,
    uom_co: undefined,
    main_el_min_value_sn: undefined,
    main_el_max_value_sn: undefined,
    precision_sn: undefined,
    uom_sn: undefined,
    main_el_min_value_n: undefined,
    main_el_max_value_n: undefined,
    precision_n: undefined,
    uom_n: undefined,
    main_el_min_value_h: undefined,
    main_el_max_value_h: undefined,
    precision_h: undefined,
    uom_h: undefined,
    main_el_min_value_as: undefined,
    main_el_max_value_as: undefined,
    uom_as: undefined,
    precision_as: undefined,
    main_el_min_value_bi: undefined,
    main_el_max_value_bi: undefined,
    uom_bi : undefined,
    precision_bi: undefined,
    main_el_min_value_ce: undefined,
    main_el_max_value_ce: undefined,
    uom_ce : undefined,
    precision_ce: undefined,
    main_el_min_value_o: undefined,
    main_el_max_value_o: undefined,
    uom_o: undefined,
    precision_o: undefined,
    main_el_min_value_pb: undefined,
    main_el_max_value_pb: undefined,
    uom_pb: undefined,
    precision_pb: undefined,
    main_el_min_value_sb: undefined,
    main_el_max_value_sb: undefined,
    uom_sb : undefined,
    precision_sb: undefined,
    main_el_min_value_w: undefined,
    main_el_max_value_w: undefined,
    uom_w: undefined,
    precision_w: undefined,
    main_el_min_value_zn: undefined,
    main_el_max_value_zn: undefined,
    uom_zn: undefined,
    precision_zn: undefined,
    main_el_min_value_zr: undefined,
    main_el_max_value_zr: undefined,
    uom_zr: undefined,
    precision_zr: undefined,
    main_el_min_value_te: undefined,
    main_el_max_value_te: undefined,
    uom_te: undefined,
    precision_te: undefined,
    main_el_min_value_rad: undefined,
    main_el_max_value_rad: undefined,
    uom_rad: undefined,
    precision_rad: undefined,
    main_el_min_value_insal: undefined,
    main_el_max_value_insal: undefined,
    uom_insal: undefined,
    precision_insal: undefined,
    main_el_min_value_n2: undefined,
    main_el_max_value_n2: undefined,
    uom_n2: undefined,
    precision_n2: undefined,

    code_1: undefined,
    other_el_min_value_1: undefined,
    other_el_max_value_1: undefined,
    other_element: [],
    flex_form_data: undefined
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
  formula_queryParams: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ["updated_at"],
    descending: [true],
  },
  chemical_list : ['c', 'si','mn', 'p','s', 'cr','mo', 'ni', 'al', 'b', 'co', 'cu', 'nb','sn', 'ti', 'v', 'ca', 'n', 'h','sal','sp', 'as', 'bi', 'ce', 'o', 'pb','sb', 'w', 'zn', 'zr', 'te', 'rad', 'insal', 'n2']

});

const {form, rules, formula_queryParams, chemical_list} = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);


const formula_tableHeaders = ref([
  {title: "Name", key: "Name"},
  {title: "Formula", key: "Formula"},
  {title: "Min", key: "Min"},
  {title: "Max", key: "Max"},
  {title: "UOM", key: "UOM"},
]);
const formula_tableList = ref([]);
const formula_total = ref(0);

const c_mn_trade_offs_tableHeaders = [
  {title: "Name", key: "Name"},
  {title: "Value", key: "Value"},
];
const c_mn_trade_offs_tableList = ref([]);
const c_mn_trade_offs_total = ref(0);

const al_n_trade_offs_tableHeaders = [
  {title: "Name", key: "Name"},
  {title: "Value", key: "Value"},

];
const al_n_trade_offs_tableList = ref([]);
const al_n_trade_offs_total = ref(0);

const n_p_trade_offs_tableHeaders = [
  {title: "Name", key: "Name"},
  {title: "Value", key: "Value"},

];
const n_p_trade_offs_tableList = ref([]);
const n_p_trade_offs_total = ref(0);



const n_binder_options_tableHeaders = ref([
  {title: "Name", key: "Name"},
  {title: "Min", key: "Min"},
  {title: "Max", key: "Max"},
  {title: "UOM", key: "UOM"},
]);
const n_binder_options_tableList = ref([]);
const n_binder_options_total = ref(0);

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
 
      formula_tableList.value = data.flex_form_data?.Formula     
      n_binder_options_tableList.value = data.flex_form_data?.N_Binder_Options
      
      al_n_trade_offs_tableList.value = data.flex_form_data?.Al_N_Trade_offs 
      c_mn_trade_offs_tableList.value = data.flex_form_data?.C_Mn_Trade_offs
      n_p_trade_offs_tableList.value = data.flex_form_data?.N_P_Trade_offs

      // 根据precision 设置 min 和max 保留的小数位
      chemical_list.value.forEach((item, index) => {
        if (data[`precision_${item}`] && data[`precision_${item}`]!=0) {
          data[`main_el_min_value_${item}`] = floatToFixed(data[`main_el_min_value_${item}`],data[`precision_${item}`])
          data[`main_el_max_value_${item}`] = floatToFixed(data[`main_el_max_value_${item}`],data[`precision_${item}`])
        }
      })
      
      form.value = {
        ...(data || {})
      };
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
