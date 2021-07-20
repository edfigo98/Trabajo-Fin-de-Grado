const xlsxFile = require('read-excel-file/node')
let WebSocketServer = require('ws').Server
// const WebSocket = require('ws')
let wss = new WebSocketServer({port: 8181})
let uuid = require('uuid')
const fichero_1 = './preprocesado 6-7.xlsx'
const fichero_2 = './preprocesado 7-8.xlsx'
const fichero_3 = './preprocesado 8-9.xlsx'
let datos = []
let array_datos = []
let resultados = []
let promedio = []

////////////////////////////////////////////////////////////////////////////////

function initialize () {
  clients = []
}

////////////////////////////////////////////////////////////////////////////////

function obtenerParametros (id_origen, id_destino, hora, cliente) {
  var interval = hora.split(':')
  let origen, destino, minute_one, inicio, minute_two, fin
  origen = id_origen.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)
  console.log(origen[0])
  console.log(destino[0])
  
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
    console.log('inicio intervalo 6-7:', inicio)
    console.log('fin maximo intervalo 6-7', fin)
  }
  if (hora >= '6:00' && hora < '7:00') {
    procesarDatosExcel(fichero_1, origen[0], destino, inicio, fin, cliente)
  } 
  if (hora >= '7:00' && hora < '8:00') {
    procesarDatosExcel(fichero_2, origen[0], destino, inicio, fin, cliente)
  } 
  if (hora >= '8:00' && hora < '9:00') {
    procesarDatosExcel(fichero_3, origen[0], destino, inicio, fin, cliente)
  }
}

////////////////////////////////////////////////////////////////////////////////

function procesarDatosExcel (fichero, origen, destino, inicio, fin, cliente) {
  xlsxFile(fichero, { sheet: 'Matrices 15 minutos' }).then((rows) => {
    console.log('fichero de entrada', fichero)
    array_datos = []
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
    calcularIntervalo(promedio[0][2], inicio, fin, cliente)
    // console.log('valor promedio en minutos: ', promedio[0][2])
    return array_datos
  })
}

////////////////////////////////////////////////////////////////////////////////

function calcularIntervalo (valor_promedio, valor_inicial, valor_final, cliente) {
  console.log('valor promedio', valor_promedio)
  console.log('valor inicial: ', valor_inicial)
  console.log('valor final: ', valor_final)
  let valor = valor_promedio * 60
  valor = valor_final - valor
  console.log('valor', valor)
  if (valor < valor_inicial) {
    cliente.ws.send('Debe salir en el intervalo anterior')
  } else {
    cliente.ws.send('Debe salir en el mismo intervalo')
  }
}

////////////////////////////////////////////////////////////////////////////////

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
    // console.log(message)
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