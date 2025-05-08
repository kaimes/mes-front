<template>
  <v-container grid-list-md>
        <FormKit type="form" v-model="localFlexFormData" :actions="false">
      <FormKitSchema :schema="schema" />
    </FormKit>
  </v-container>
</template>

<script>
import { cloneDeep } from 'lodash';

const formkit_type_category = {
  boolean: 'boolean',
  string: 'text',
  number: 'number'
};

export default {
  name: 'WorkerFlexFormComponent',

  components: {},
methods: {},

  props: {
    formSchema: {
      type: Object,
      default: function () {
        return {
          type: 'object',
          properties: {
            level: {
              type: 'number',
              title: 'requested min level (integer)'
            },
            skills: {
              type: 'array',
              title: 'requested_skills',
              items: {
                type: 'string'
              }
            }
          }
        };
      }
    },
    formData: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },

  computed: {
    localFlexFormData: {
      get() {
        const flex_form_data = JSON.parse(JSON.stringify(this.formSchema));
        const obj = flex_form_data['properties'];
        const schema_keys = {};
        Object.keys(obj).forEach((key) => {
          if ('type' in obj[key]) {
            if ('default' in obj[key]) {
              schema_keys[key] = obj[key]['default'];
            }
          }
        });
// console.log(schema_keys);
        // 取他的默认值
        return Object.assign({}, schema_keys, this.formData);
      },
      set(newData) {
        // console.log(newData);
        this.$emit('update:formData', newData);
      }
    },
    schema: function () {
      const flex_form_data = JSON.parse(JSON.stringify(this.formSchema));
      const obj = flex_form_data['properties'];
      const list_schema = [];
      Object.keys(obj).forEach((key) => {
        if ('type' in obj[key]) {
const formkit_type =
            obj[key]['type'] === 'string' ? 'text' : 'number';
          // const type_name = obj[key]['type'];
          //
          // const formkit_type = formkit_type_category[type_name];
          list_schema.push({
            $formkit: formkit_type,
          name: key,
          label: obj[key]['title']
          });
        }
      });
      // console.log({ list_schema });
      return list_schema;
    }
  },
  
  data() {
    return {};
  },
  watch: {
    // localFlexFormData: function (newData) {
    //   console.log(newData);
    // }
  }
};
</script>
