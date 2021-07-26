<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="pt-4"
      color="grey lighten-3"
      mini-variant
    >
      <v-avatar
        v-for="n in 6"
        :key="n"
        :color="`grey ${n === 1 ? 'darken' : 'lighten'}-1`"
        :size="n === 1 ? 36 : 20"
        class="d-block text-center mx-auto mb-9"
      ></v-avatar>
    </v-navigation-drawer>

    <v-main>
      <!--  -->
      <!-- <connect name="connect" /> -->
      <request name="request" />
    </v-main>
  </v-app>
</template>


<script>
  // import ConnectServe from './components/ConnectServe.vue'
  import RequestData from './components/RequestData.vue'
  export default {
    name: 'App',
    components: {
      // connect: ConnectServe,
      request: RequestData,
    },
    data: () => ({ 
      drawer: null 
    }),
  }
</script>