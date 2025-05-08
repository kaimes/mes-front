<template>
  <FormKit type="form" v-model="data">
    <FormKitSchema :schema="schema" />
  </FormKit>
  <pre wrap>{{ data }}</pre>
</template>


<script>
export default {
  name: 'FormKitFlexFormDemo',

  data() {
    return {
      data: {
        email: '123123qqqqqqq123',
        password: '123123'
      },

      schema: [
        {
          $formkit: 'text',
          name: 'email',
          label: 'Email'
        },
        {
          $formkit: 'number',
          name: 'count',
          label: 'count'
        },
        {
          $formkit: 'radio',
          name: 'sss',
          label: 'count',
          options: [
            { value: true, label: 'true' },
            { value: false, label: 'false' }
          ]
        }
      ]
    };
  },
  methods: {
    async register() {
      await new Promise((r) => setTimeout(r, 2000));
      alert('Account created!');
    }
  }
};
</script>

