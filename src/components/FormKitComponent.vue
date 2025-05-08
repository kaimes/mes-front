<template>
  <v-container fluid>
    <div v-if="schema.length !== 0">
      <FormKit type="form" v-model="localFlexFormData" :actions="false">
        <!--  options 选项 在chekbox 中 就是多个选项了, 这里要区分 ,所以加了一个 if 判断  -->
        <template v-for="item in schema" :key="item.name">
          <FormKit
            v-if="item.type === 'select'"
            :type="item.type"
            :name="item.name"
            :label="item.label"
            :options="item.options"
            :help="item.description"
          />
          <FormKit
            v-else
            :type="item.type"
            :name="item.name"
            :label="item.label"
            :help="item.description"
          />
        </template>
      </FormKit>
    </div>
    <div v-else>
      <v-card v-if="!nodata">
        <v-card-item>
          <v-card-title> Nothing Data </v-card-title>
          <v-card-subtitle>
            First you need to config the flex form data
          </v-card-subtitle>
        </v-card-item>

        <v-card-text> No flex_form_data data available. </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import { cloneDeep } from 'lodash';

const formkit_type_category = {
  boolean: 'checkbox',
  string: 'text',
  number: 'number'
};

export default {
  name: 'FormKitComponent',

  components: {},

  props: {
    // 无数据是否显示下面的提示信息
    nodata: { type: Boolean, default: false },

    // 单纯文字显示,类别
    flex_form_type: {
      type: String,
      default: ''
    },
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
        if (!obj) {
          return {};
        }
        Object.keys(obj).forEach((key) => {
          if ('type' in obj[key]) {
            if ('default' in obj[key]) {
              schema_keys[key] = obj[key]['default'];
            }
          }
        });
        const result = Object.assign({}, schema_keys, this.formData);
        return result;
      },
      set(newData) {
        this.$emit('update:formData', newData);
      }
    },
    schema: function () {
      const flex_form_data = JSON.parse(JSON.stringify(this.formSchema));
      const obj = flex_form_data['properties'];
      const list_schema = [];
      if (!obj) {
        return [];
      }
      Object.keys(obj).forEach((key) => {
        if ('type' in obj[key]) {
          const item = obj[key];
          const { type: type_name, title, description } = item;

          // pluagin -service 页面 有个例外 ,  如果没有title 字段 就用 key , 用于显示标题
          const label = item['title'] ? item['title'] : key;
          const name = key;

          let options = [];
          let type_new;
          if ('enum' in item) {
            type_new = 'select';
            options = item['enum'];
          } else {
            type_new = formkit_type_category[type_name];
          }
          list_schema.push({
            name,
            description,
            type: type_new,
            options,
            label
          });
        }
      });
      return list_schema;
    }
  }
};
</script>



