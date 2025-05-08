import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VTreeview } from 'vuetify/labs/VTreeview'


// https://theme-generator.vuetifyjs.com/
// let purple_theme = {
//     primary: '#9c27b0',
//     secondary: '#3f51b5',
//     accent: '#03a9f4',
//     error: '#f44336',
//     warning: '#ffeb3b',
//     info: '#009688',
//     success: '#4caf50'
//     };
import colors from 'vuetify/util/colors'

let pp_theme = {
  purple: '#996189',
  primary: colors.purple.darken2, // '#9c27b0',
  // primary: '#996189',
  secondary: '#8DC5B6',
  primaryBackground: colors.purple.darken1,
  backgroundColor: colors.grey.lighten5,
  greyBackground: colors.grey.lighten3,
  greyBorder: colors.grey.lighten1,
  grey: colors.grey.darken4,
  darkGrey: colors.grey.darken2,
  greenSuccess: '#4db6ac',
  topic: colors.grey.base,
  video: '#283593',
  image: '#283593', // IDK what this is supposed to be
  audio: '#f06292',
  document: '#ff3d00',
  exercise: '#4db6ac',
  html5: '#ff8f00',
  slideshow: '#4ece90',
  channelHighlightDefault: colors.grey.lighten3,
};


let my_pp_theme = {
  purple: '#996189',
  // primary: '#996189',
  secondary: '#8DC5B6',
  primaryBackground: colors.purple.darken1,
  backgroundColor: colors.grey.lighten5,
  greyBackground: colors.grey.lighten3,
  greyBorder: colors.grey.lighten1,
  grey: colors.grey.darken4,
  darkGrey: colors.grey.darken2,
  greenSuccess: '#4db6ac',
  topic: colors.grey.base,
  video: '#283593',
  image: '#283593', // IDK what this is supposed to be
  audio: '#f06292',
  document: '#ff3d00',
  exercise: '#4db6ac',
  html5: '#ff8f00',
  slideshow: '#4ece90',
  channelHighlightDefault: colors.grey.lighten3,
};

let my_defaults = {
  VTextField: {
    variant: "underlined"
  },
  VTextarea: {
    variant: "underlined"
  },
  VSelect: {
    variant: "underlined",
    itemTitle: "text"
  },
  VAutocomplete: {
    variant: "underlined",
    itemTitle: "text"
  },
  VCombobox: {
    variant: "underlined",
    itemTitle: "text"
  },
  VExpansionPanel: {
    elevation: 0
  },
  VCheckbox: {
    color: "primary"
  },
  VRadioGroup: {
    color: "primary"
  },
  VSwitch: {
    color: "primary"
  },
  VProgressLinear: {
    color: "primary"
  },
  VIcon: {
    color: "#616161"
    // 这里可以直接更改所有图标的颜色
    // color: "primary",
  },
  VDataTable: {
    hover: true,
    VSelect: {
      itemTitle: "title"
    }
  },
  VDataTableServer: {
    hover: true,
    itemsPerPageOptions: [{value: 10, title: '10'}, {value: 25, title: '25'}, {value: 50, title: '50'}, {value: 100, title: '100'}],
    VSelect: {
      itemTitle: "title"
    }
  }
};

export function vuetifyPlugin(app) {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: {
          colors: my_pp_theme
        }
      }
    },
    defaults: my_defaults,
    components: {
      ...components, VTreeview
    },
    directives
  });

  app.use(vuetify);
}
