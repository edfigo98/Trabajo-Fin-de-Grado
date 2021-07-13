let _ = require('underscore')
const xlsxFile = require('read-excel-file/node')
// const xlsx = require('xlsx')
let WebSocketServer = require('ws').Server
const WebSocket = require('ws')
let wss = new WebSocketServer({port: 8181})
let uuid = require('uuid')

function initialize () {
  clients = []
}

////////////////////////////////////////////////////////////////////////////////

function leerExcel6_7(id_salida, id_destino, hora) {
  var interval = hora.split(':')
  let salida, destino, minute_one, seconds_one, minute_two, seconds_two
  let datos = []
  salida = id_salida.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)
  console.log(salida[0])
  console.log(destino[0])

  if(interval.length === 3) {
    minute_one = parseInt(interval[1], 10);
    minute_two = parseInt(interval[2], 10);
    if (interval[2] == '00') {
      seconds_one = minute_one * 60
      seconds_two = 3600
    } else {
      seconds_one = minute_one * 60
      seconds_two = minute_two * 60
    }
    console.log('segundos minimo intervalo 6-7:', seconds_one)
    console.log('segundos maximo intervalo 6-7', seconds_two)
  }
  
  let resultados = []
  xlsxFile('./preprocesado 6-7.xlsx', { sheet: 'Matrices 15 minutos' }).then((rows) => {
    for (i in rows) {
      datos = (rows[i].filter(x => x !== null))
      resultados.push(datos)
    }
    if (seconds_one === 0 && seconds_two === 900) {
      if (destino.includes('96')) {
        // console.log('identificador salida ', salida[0])
        // console.log('id destino', destino)
        let result = []
        result.push(resultados.slice(0,20))
        // console.log('array inicial', result)
        let prueba = []
        prueba = result.map(x => x.filter(element => element === salida[0]))
        // result.forEach(element => {

        //   // element.forEach(x => {
        //   //   // result = x.filter(y => y === salida[0])
        //   //   // console.log(x)
        //   //   for (var i = 0; i < x.length; i++) {
        //   //     console.log('prueba', x[i])
        //   //   }
        //   // })
        //   // result = element[0].filter(x => x === salida[0])
        // })
        console.log('array', prueba)

        // console.log('resultados: ' , resultados.slice(0,20).find(element => element === salida[0]))
        // for (var i = 0; i < resultados.slice(0,20).length; i++) {
        //   console.log(resultados[i].slice(0,20).filter(element => element === 1))
        // }
      }
    }
    if (seconds_one === 900 && seconds_two === 1800) {  
      console.log(resultados.slice(78, 156))
    }
    if (seconds_one === 1800 && seconds_two === 2700) {  
      console.log(resultados.slice(156, 234))
    }
    if (seconds_one === 2700 && seconds_two === 3600) {  
      console.log(resultados.slice(234, 320))
    }
  })
}

function leerExcel7_8(id_salida, id_destino, hora) {
  var interval = hora.split(':')
  let salida, destino, minute_one, seconds_one, minute_two, seconds_two
  salida = id_salida.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)
  console.log(salida[0])
  console.log(destino[0])

  if(interval.length === 3) {
    minute_one = parseInt(interval[1], 10);
    minute_two = parseInt(interval[2], 10);
    if (interval[2] == '00') {      
      seconds_one = minute_one * 60
      seconds_two = 3600
    } else {
      seconds_one = minute_one * 60
      seconds_two = minute_two * 60
    }
    console.log('segundos minimo intervalo 7-8:', seconds_one)
    console.log('segundos maximo intervalo 7-8', seconds_two)
  }
}

function leerExcel8_9(id_salida, id_destino, hora) {
  var interval = hora.split(':')
  let salida, destino, minute_one, seconds_one, minute_two, seconds_two
  salida = id_salida.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)
  console.log(salida[0])
  console.log(destino[0])

  if(interval.length === 3) {
    minute_one = parseInt(interval[1], 10);
    minute_two = parseInt(interval[2], 10);
    if (interval[2] == '00') {      
      seconds_one = minute_one * 60
      seconds_two = 3600
    } else {
      seconds_one = minute_one * 60
      seconds_two = minute_two * 60
    }
    console.log('segundos minimo intervalo 8-9:', seconds_one)
    console.log('segundos maximo intervalo 8-9', seconds_two)
  }
}

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
  
  websocket.on('message', function incoming(message) {
    // console.log(message)
    data = JSON.parse(message)
    id_salida = data.salida
    id_destino = data.destino
    hora = data.hora
    console.log('id salida:', id_salida)
    console.log('id destino:', id_destino)
    console.log('hora:', hora)
    if (hora >= '6:00' && hora < '7:00') {
      leerExcel6_7(id_salida, id_destino, hora)
    } else if (hora >= '7:00' && hora < '8:00') {
      leerExcel7_8(id_salida, id_destino, hora)
    } else if (hora >= '8:00' && hora < '9:00') {
      leerExcel8_9(id_salida, id_destino, hora)
    }
  })
});

initialize()