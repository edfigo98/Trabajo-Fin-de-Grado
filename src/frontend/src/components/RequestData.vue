<template>
  <div class="button-request">
    <v-btn
      elevation="5"
      @click="requestData()"
    >
      Calcular intervalo de salida
    </v-btn>
    <v-row>
      <v-col
        cols="1"
        sm="4"
        md="8"
        class="request"
      >
        <v-select
          v-model="salida"
          :items="lugares_salida"
          label="Lugar de salida"
        />
        <v-select
          v-model="destino"
          :items="lugares_destino"
          label="Lugar de destino"
        />
        <v-select
          v-model="hora"
          :items="horas"
          label="Hora prevista de llegada"
        />
      </v-col>
    </v-row>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              Origen
            </th>
            <th class="text-left">
              Destino
            </th>
            <th class="text-left">
              Hora de salida
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in intervalo"
            :key="item"
          >
            <td>{{ item.salida }}</td>
            <td>{{ item.destino }}</td>
            <td>{{ item.hora }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>

  export default {
    name: 'RequestData',
    data: function () {
      return {
        connection: null,
        url: 'ws://localhost:8181',
        salida: '',
        destino: '',
        hora: '',
        lugares_salida: ['ID 1: Los Realejos', 'ID 3: Higuerita - Los Realejos', 'ID 12: Alcampo La Villa', 'ID 17: Polígono San Nicolás', 'ID 26: El Ramal - La Orotava', 'ID 36: La Cuesta de la Villa', 'ID 43: La Quinta - Santa Úrsula', 'ID 47: Alteza - Santa Úrsula', 'ID 52: La Victoria', 'ID 59: La Matanza', 'ID 70: El Sauzal', 'ID 76: Tacoronte', 'ID 82: Los Naranjeros - Tacoronte', 'ID 92: Guamasa - La Laguna', 'ID 96: Aeropuerto Tenerife Norte', 'ID 108: Padre Anchieta - La Laguna', 'ID 113: Guajara'],
        lugares_destino: ['ID 96: Aeropuerto Tenerife Norte', 'ID 108: Padre Anchieta - La Laguna', 'ID 113: Guajara', 'ID: 120: Camino La Hornera - Santa Cruz de Tenerife'],
        horas: ['6:00 - 6:15', '6:15 - 6:30', '6:30 - 6:45', '6:45 - 7:00', '7:00 - 7:15', '7:15 - 7:30', '7:30 - 7:45', '7:45 - 8:00', '8:00 - 8:15', '8:15 - 8:30', '8:30 - 8:45', '8:45 - 9:00',],
        origen: [],
        destino_: [],
        intervalo: [],
      }
    },

    methods: {
      requestData () {
        const connection = new WebSocket(this.url)
        connection.onopen = () => {
          // insert data as it arrives from the socket
          connection.send(`{ "salida": "${this.salida}", "destino": "${this.destino}", "hora": "${this.hora}" }`)          
          connection.onmessage = async (event) => {
            alert(event.data)
            var jsonObject = {
              "salida": this.salida,
              "destino": this.destino,
              "hora": event.data
            }
            this.intervalo.push(jsonObject)
            console.log(this.intervalo)
          }
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.button-request {
  margin-top: 60px;
  margin-left: 60px;
}

#update {
  width: 20px;
  margin-left: 10px;
  margin-top: 10px;
}

#update:hover {
  background-color: lightslategrey;
  cursor: pointer;
}

#list {
  margin-left: 20px;
  margin-top: 10px;
}
</style>