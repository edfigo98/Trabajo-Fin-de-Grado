<template>
  <div class="button-connect">
    <div class="led-box">
      <div
        class="led-light"
        :class="connect === true ? 'led-green' : 'led-red'"
      />
      <p id="connect">
        {{ connect === true ? '' : 'Not ' }}Connected
      </p>
    </div>
    <v-btn
      elevation="5"
      @click="connectServe()"
    >
      CONNECT SERVE
    </v-btn>
    <v-row>
      <v-col
        cols="1"
        sm="4"
        md="11"
      >
        <v-text-field
          id="server-url"
          v-model="url"
          placeholder="Server URL"
        />
      </v-col>
    </v-row>
    <request
      v-if="connect === true"
      class="button-request"
    />
  </div>
</template>

<script>
  import RequestData from './RequestData.vue'
  export default {
    name: 'ConnectServe',
    components: {
      request: RequestData,
    },
    data: function () {
      return {
        url: 'ws://localhost:8181',
        connect: false,
        salida: '',
        destino: ''
      }
    },

    methods: {
      connectServe (url, salida, destino) {
        const connection = new WebSocket(this.url)
        connection.onopen = () => {
          if (connection.readyState === WebSocket.OPEN) {
            alert('Successfully connected to the echo websocket server...')
          }
          console.log(connection) 
        }
        connection.onerror = (error) => {
          console.log(`WebSocket error: ${error}`)
        }
        connection.onmessage = (e) => {
          const dat = JSON.parse(e.data)
          // const datos = e.data.tripinfos.tripinfo[0].id;
          // console.log(datos)
          // for (const i in datos.target) {
          //   console.log(datos.data.tripinfos.tripinfo[i].id)
          // }
          // console.log(dat)
          this.obtainTime(dat, salida, destino)
        }
      },
      async obtainTime(datos, salida, destino) {
        console.log(datos)
        console.log(salida)
        console.log(destino)
        // console.log(datos.tripinfos.tripinfo[0].id)
        // const dat = []
        // dat.push(datos)
        // dat.map(obj => {
        //   const data = JSON.stringify(obj)
        //   console.log(data)
        //   for (let i = 0; i < data.length; i++) {
        //     console.log(data.tripinfos.tripinfo[i].id)
        //   }
        // })
        // console.log(dat)
        // for (let i = 0; dat.length; i++) {
        //   console.log(dat.tripinfo[i].id)
        // }
        
        if ( (salida == datos.tripinfos.tripinfo[0].departLane) && (destino == datos.tripinfos.tripinfo[0].arrivalLane)) {
          const duration = ((parseInt(datos.tripinfos.tripinfo[0].duration) + parseInt(datos.tripinfos.tripinfo[0].timeLoss)) * 10)
          alert('Duración del trayecto en minutos es aprox.: ' + duration / 60)
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button-connect {
  margin-bottom: -50px;
  margin-left: 10px;
  margin-top: 10px;
}

#server-url {
  margin-top: 20px;
  margin-left: 10px;
}

#connect {
  margin-top: -20px;
  color: black;
}

.led-box {
  margin-top: -10px;
  margin-left: -20px;
  margin-bottom: 10px;
  height: 30px;
  width: 100%;
}

.led-box p {
  font-size: 12px;
  text-align: center;
  margin: 1em;
}

.led-light {
  margin: 0 auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.led-red {
  background-color: #f00;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px;
}

.led-green {
  background-color: #abff00;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89ff00 0 2px 12px;
}

</style>
