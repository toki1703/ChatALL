import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import store from "./store";
import Chats from "@/store/chats";
import { migrateChatsMessagesThreads } from "@/store/migration";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
import { useI18n } from "vue-i18n";
import "material-design-icons/iconfont/material-icons.css";
import VueMatomo from "vue-matomo";
import VueShortkey from "vue3-shortkey";
import { resolveTheme, applyTheme } from "./theme";

// Vuetify
import "vuetify/styles";
import "@/assets/m3-expressive.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// VMdPreview
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import createLineNumbertPlugin from "@kangc/v-md-editor/lib/plugins/line-number/index";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import Prism from "prismjs";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/npm";

VMdPreview.use(vuepressTheme, {
  Prism,
})
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createKatexPlugin());

const { ipcRenderer } = window.require("electron");

await store.restored; // wait for state to be restore
i18n.global.locale.value = store.state.lang;
store.commit("migrateSettingsPrompts");
store.commit("migrateSettingArrayIndexUseUUID");
await migrateChatsMessagesThreads();
await Chats.addFirstChatIfEmpty();

const defaultTheme = await resolveTheme(store.state.mode, ipcRenderer);
store.commit("setTheme", defaultTheme);
applyTheme(defaultTheme);
ipcRenderer.invoke("set-is-show-menu-bar", store.state.general.isShowMenuBar);
ipcRenderer.on("commit", (e, mutation, value) => {
  store.commit(mutation, value);
});

const vuetify = createVuetify({
  components: { ...components },
  directives,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme,
    themes: {
      // Material 3 Expressive - light scheme (violet primary, rose tertiary)
      light: {
        dark: false,
        colors: {
          primary: "#6750A4",
          "on-primary": "#FFFFFF",
          "primary-container": "#E9DDFF",
          "on-primary-container": "#22005D",
          secondary: "#625B71",
          "on-secondary": "#FFFFFF",
          "secondary-container": "#E8DEF8",
          "on-secondary-container": "#1E192B",
          tertiary: "#B3306E",
          "on-tertiary": "#FFFFFF",
          "tertiary-container": "#FFD9E2",
          "on-tertiary-container": "#3E001D",
          error: "#BA1A1A",
          "on-error": "#FFFFFF",
          "error-container": "#FFDAD6",
          "on-error-container": "#410002",
          background: "#FEF7FF",
          "on-background": "#1D1B20",
          surface: "#FEF7FF",
          "on-surface": "#1D1B20",
          "surface-variant": "#E7E0EB",
          "on-surface-variant": "#49454E",
          "surface-bright": "#FEF7FF",
          "surface-container-lowest": "#FFFFFF",
          "surface-container-low": "#F7F2FA",
          "surface-container": "#F3EDF7",
          "surface-container-high": "#ECE6F0",
          "surface-container-highest": "#E6E0E9",
          outline: "#79747E",
          "outline-variant": "#CAC4D0",
          // App-specific tokens mapped onto the M3 surfaces / roles
          header: "#F7F2FA",
          prompt: "#E9DDFF",
          response: "#F7F2FA",
          font: "#1D1B20",
          "table-tr-2n": "#F3EDF7",
          "code-font": "#5B4B8A",
          "code-background": "#F3EDF7",
        },
      },
      // Material 3 Expressive - dark scheme
      dark: {
        dark: true,
        colors: {
          primary: "#D0BCFF",
          "on-primary": "#381E72",
          "primary-container": "#4F378A",
          "on-primary-container": "#E9DDFF",
          secondary: "#CCC2DC",
          "on-secondary": "#332D41",
          "secondary-container": "#4A4458",
          "on-secondary-container": "#E8DEF8",
          tertiary: "#FFB0C8",
          "on-tertiary": "#5E1133",
          "tertiary-container": "#7B2949",
          "on-tertiary-container": "#FFD9E2",
          error: "#FFB4AB",
          "on-error": "#690005",
          "error-container": "#93000A",
          "on-error-container": "#FFDAD6",
          background: "#141218",
          "on-background": "#E6E0E9",
          surface: "#141218",
          "on-surface": "#E6E0E9",
          "surface-variant": "#49454E",
          "on-surface-variant": "#CAC4D0",
          "surface-bright": "#3B383E",
          "surface-container-lowest": "#0F0D13",
          "surface-container-low": "#1D1B20",
          "surface-container": "#211F26",
          "surface-container-high": "#2B2930",
          "surface-container-highest": "#36343B",
          outline: "#938F99",
          "outline-variant": "#49454E",
          // App-specific tokens mapped onto the M3 surfaces / roles
          header: "#211F26",
          prompt: "#4F378A",
          response: "#211F26",
          font: "#E6E0E9",
          "table-tr-2n": "#2B2930",
          "code-font": "#D0BCFF",
          "code-background": "#211F26",
        },
      },
    },
  },
  defaults: {
    // Material 3 Expressive shape: rounder, pill-shaped controls
    VBtn: {
      rounded: "pill",
      class: "text-none",
    },
    VCard: {
      rounded: "xl",
    },
    VChip: {
      rounded: "pill",
    },
    VList: {
      rounded: "lg",
    },
    VTextField: {
      rounded: "lg",
    },
    VTextarea: {
      rounded: "lg",
    },
    VSelect: {
      rounded: "lg",
    },
    VSwitch: {
      inset: true,
      color: "primary",
    },
    VAppBar: {
      flat: true,
    },
  },
});

// Inject geetest script for iFlytek Spark
fetch("https://static.geetest.com/g5/gd.js")
  .then((response) => response.text())
  .then((text) => {
    const script = document.createElement("script");
    script.textContent = text;
    document.head.appendChild(script);
  });

createApp(App)
  .use(i18n)
  .use(store)
  .use(vuetify)
  .use(VMdPreview)
  .use(VueShortkey)
  .use(VueMatomo, {
    // Configure your matomo server and site by providing
    host: "https://matomo.chatall.ai/",
    siteId: 1,

    // Changes the default .js and .php endpoint's filename
    // Default: 'matomo'
    trackerFileName: "matomo",

    // Overrides the autogenerated tracker endpoint entirely
    // Default: undefined
    // trackerUrl: 'https://example.com/whatever/endpoint/you/have',

    // Overrides the autogenerated tracker script path entirely
    // Default: undefined
    // trackerScriptUrl: 'https://example.com/whatever/script/path/you/have',

    // Enables automatically registering pageviews on the router
    router: null,

    // Enables link tracking on regular links. Note that this won't
    // work for routing links (ie. internal Vue router links)
    // Default: true
    enableLinkTracking: true,

    // Require consent before sending tracking information to matomo
    // Default: false
    requireConsent: false,

    // Whether to track the initial page view
    // Default: true
    trackInitialView: true,

    // Run Matomo without cookies
    // Default: false
    disableCookies: true,

    // Require consent before creating matomo session cookie
    // Default: false
    requireCookieConsent: false,

    // Enable the heartbeat timer (https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page)
    // Default: false
    enableHeartBeatTimer: false,

    // Set the heartbeat timer interval
    // Default: 15
    heartBeatTimerInterval: 15,

    // Whether or not to log debug information
    // Default: false
    debug: false,

    // UserID passed to Matomo (see https://developer.matomo.org/guides/tracking-javascript-guide#user-id)
    // Default: undefined
    userId: undefined,

    // Share the tracking cookie across subdomains (see https://developer.matomo.org/guides/tracking-javascript-guide#measuring-domains-andor-sub-domains)
    // Default: undefined, example '*.example.com'
    cookieDomain: undefined,
    // setDomains: [".", "localhost", "127.0.0.1"],
    // enableCrossDomainLinking: true,

    // Tell Matomo the website domain so that clicks on these domains are not tracked as 'Outlinks'
    // Default: undefined, example: '*.example.com'
    domains: "*",

    // A list of pre-initialization actions that run before matomo is loaded
    // Default: []
    // Example: [
    //   ['API_method_name', parameter_list],
    //   ['setCustomVariable','1','VisitorType','Member'],
    //   ['appendToTrackingUrl', 'new_visit=1'],
    //   etc.
    // ]
    preInitActions: [
      [
        "setCustomVariable",
        "1",
        "AppVersion",
        require("../package.json").version,
        "visit",
      ],
    ],

    // A function to determine whether to track an interaction as a site search
    // instead of as a page view. If not a function, all interactions will be
    // tracked as page views. Receives the new route as an argument, and
    // returns either an object of keyword, category (optional) and resultsCount
    // (optional) to track as a site search, or a falsey value to track as a page
    // view.
    // Default: false, i.e. track all interactions as page views
    // Example: (to) => {
    //   if (to.query.q && to.name === 'search') {
    //     return { keyword: to.query.q, category: to.params.category }
    //   } else {
    //    return null
    //   }
    // }
    trackSiteSearch: false,

    // Set this to include crossorigin attribute on the matomo script import
    // Default: undefined, possible values : 'anonymous', 'use-credentials'
    crossOrigin: undefined,
  })
  .mount("#app");
