<template>
  <div id="app">
    <Aside />
    <div class="model">
      <Model />
    </div>
  </div>
</template>

<script>
import Model from "~/components/Model"; //No dynamic import this
export default {
  name: 'Catalog',
  components: {
    Aside: () => import('~/components/Aside'),
    Model
  }
}
</script>
