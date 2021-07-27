const xlsxFile = require('read-excel-file/node')
let WebSocketServer = require('ws').Server
let wss = new WebSocketServer({port: 8181})
let uuid = require('uuid')
const fichero_1 = './preprocesado 6-7.xlsx'
const fichero_2 = './preprocesado 7-8.xlsx'
const fichero_3 = './preprocesado 8-9.xlsx'
let datos = []
let array_datos = []
let resultados = []
let promedio = []
let horas = ['6:00 - 6:15', '6:15 - 6:30', '6:30 - 6:45', '6:45 - 7:00', '7:00 - 7:15', '7:15 - 7:30', '7:30 - 7:45', '7:45 - 8:00', '8:00 - 8:15', '8:15 - 8:30', '8:30 - 8:45', '8:45 - 9:00',]

//////////////////////////////////////////////////////////////////////////////////////////////

function initialize () {
  clients = []
}

//////////////////////////////////////////////////////////////////////////////////////////////

function obtenerParametros (id_origen, id_destino, hora, cliente) {
  var interval = hora.split(':')
  let origen, destino, minute_one, inicio, minute_two, fin
  origen = id_origen.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)
  
  if(interval.length === 3) {
    minute_one = parseInt(interval[1], 10);
    minute_two = parseInt(interval[2], 10);
    if (interval[2] == '00') {
      inicio = minute_one * 60
      fin = 3600
    } else {
      inicio = minute_one * 60
      fin = minute_two * 60
    }
  }
  if (hora >= '6:00' && hora < '7:00') {
    procesarDatosExcel(fichero_1, origen[0], destino, hora, inicio, fin, cliente)
  } 
  if (hora >= '7:00' && hora < '8:00') {
    procesarDatosExcel(fichero_2, origen[0], destino, hora, inicio, fin, cliente)
  } 
  if (hora >= '8:00' && hora < '9:00') {
    procesarDatosExcel(fichero_3, origen[0], destino, hora, inicio, fin, cliente)
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

function procesarDatosExcel (fichero, origen, destino, hora, inicio, fin, cliente) {
  xlsxFile(fichero, { sheet: 'Matrices 15 minutos' }).then((rows) => {
    for (i in rows) {
      datos = (rows[i].filter(x => x !== null))
      array_datos.push(datos)
    }
    if (inicio === 0 && fin === 900) {
      if (destino.includes('96')) {
        resultados = array_datos.slice(0,20)
      }
      if (destino.includes('108')) {
        resultados = array_datos.slice(20,38)
      }
      if (destino.includes('113')) {
        resultados = array_datos.slice(38,56)
      }
      if (destino.includes('120')) {
        resultados = array_datos.slice(56,78)
      }
    }
    if (inicio === 900 && fin === 1800) {  
      if (destino.includes('96')) {
        resultados = array_datos.slice(78, 98)
      }
      if (destino.includes('108')) {
        resultados = array_datos.slice(98, 116)
      }
      if (destino.includes('113')) {
        resultados = array_datos.slice(116, 135)
      }
      if (destino.includes('120')) {
        resultados = array_datos.slice(135, 156)
      }
    }
    if (inicio === 1800 && fin === 2700) {  
      if (destino.includes('96')) {
        resultados = array_datos.slice(156, 176)
      }
      if (destino.includes('108')) {
        resultados = array_datos.slice(176, 194)
      }
      if (destino.includes('113')) {
        resultados = array_datos.slice(194, 213)
      }
      if (destino.includes('120')) {
        resultados = array_datos.slice(213, 234)
      }
    }
    if (inicio === 2700 && fin === 3600) {  
      if (destino.includes('96')) {
        resultados = array_datos.slice(234, 254)
      }
      if (destino.includes('108')) {
        resultados = array_datos.slice(254, 272)
      }
      if (destino.includes('113')) {
        resultados = array_datos.slice(272, 291)
      }
      if (destino.includes('120')) {
        resultados = array_datos.slice(291, 310)
      }
    }
    console.log('array inicial', resultados)
    promedio = resultados.map(x => x).filter(x => x[0] == origen)
    console.log('datos punto origen: ', promedio)
    calcularIntervalo(promedio[0][2], hora, inicio, fin, cliente)
    return array_datos
  })
}

//////////////////////////////////////////////////////////////////////////////////////////////

function calcularIntervalo (valor_promedio, hora, valor_inicial, valor_final, cliente) {
  let valor = valor_promedio * 60
  console.log('valor promedio en minutos', valor_promedio)
  valor = valor_final - valor
  console.log('incio en segundos', valor_inicial)
  console.log('valor promedio en segundos', valor)
  console.log('fin en segundos', valor_final)
  let intervalo = horas.filter(element => element < hora)
  let contador = 0
  let intervalo_salida = []

  if (valor < valor_inicial && hora === '6:00 - 6:15') {
    cliente.ws.send('Debe salir antes de las 6:00')
  } else {
    if (valor < valor_inicial) {
      while (valor < valor_inicial) {
        valor_inicial -= 900
        contador++
        intervalo_salida = intervalo[intervalo.length - contador]
        console.log('contador', contador)
        console.log('interv', intervalo_salida)
        console.log('valor_inicial', valor_inicial)
        console.log('valor', valor)
      }
      cliente.ws.send('Debe salir entre: ' + intervalo_salida)  
    } else {
      cliente.ws.send('Debe salir entre: ' + hora)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

wss.on('connection', function (websocket) {
  websocket.on('close', function (websocket) {
    console.log("Client Disconnected!")
  })
  let id_salida
  let id_destino
  let hora
  var client_uuid = uuid.v4()
  var client = {'id': client_uuid, 'ws': websocket}
  clients.push(client)
  console.log('# New client [%s] connected', client_uuid)
  
  websocket.on('message', function incoming (message) {
    data = JSON.parse(message)
    id_salida = data.salida
    id_destino = data.destino
    hora = data.hora
    console.log('id salida:', id_salida)
    console.log('id destino:', id_destino)
    console.log('hora:', hora)
    obtenerParametros(id_salida, id_destino, hora, client)
  })
});

initialize()