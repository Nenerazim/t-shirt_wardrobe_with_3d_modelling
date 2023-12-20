import Vue from "vue"

import vco from "v-click-outside";

Vue.use(vco);

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue()
