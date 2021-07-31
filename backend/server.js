const xlsxFile = require('read-excel-file/node')
const expect = require('expect');
let WebSocketServer = require('ws').Server
let wss = new WebSocketServer({port: 8181})
let uuid = require('uuid')
const excel_6_7 = './data/preprocesado 6-7.xlsx'
const excel_7_8 = './data/preprocesado 7-8.xlsx'
const excel_8_9 = './data/preprocesado 8-9.xlsx'
let datos = []
let array_datos = []
let resultados = []
let promedio = []
let horas = ['5:00 - 5:15', '5:15 - 5:30', '5:30 - 5:45', '5:45 - 6:00', '6:00 - 6:15', '6:15 - 6:30', '6:30 - 6:45', '6:45 - 7:00', '7:00 - 7:15', '7:15 - 7:30', '7:30 - 7:45', '7:45 - 8:00', '8:00 - 8:15', '8:15 - 8:30', '8:30 - 8:45', '8:45 - 9:00',]

//////////////////////////////////////////////////////////////////////////////////////////////

function initialize () {
  clients = []
}

//////////////////////////////////////////////////////////////////////////////////////////////

function obtenerParametros (id_origen, id_destino, hora, cliente) {
  var interval = hora.split(':')
  origen = id_origen.match(/(\d+)/)
  destino = id_destino.match(/(\d+)/)

  if(interval.length === 3) {
    let num_min_1 = parseInt(interval[1], 10);
    let num_min_2 = parseInt(interval[2], 10);
    if (interval[2] == '00') {
      inicio = num_min_1 * 60
      fin = 3600
    } else {
      inicio = num_min_1 * 60
      fin = num_min_2 * 60
    }
  }

  if (hora >= '6:00' && hora < '7:00') {
    procesarDatosExcel(excel_6_7, origen[0], destino, hora, inicio, fin, cliente)
  } 
  if (hora >= '7:00' && hora < '8:00') {
    procesarDatosExcel(excel_7_8, origen[0], destino, hora, inicio, fin, cliente)
  } 
  if (hora >= '8:00' && hora < '9:00') {
    procesarDatosExcel(excel_8_9, origen[0], destino, hora, inicio, fin, cliente)
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

function procesarDatosExcel (excel, origen, destino, hora, inicio, fin, cliente) {
  xlsxFile(excel, { sheet: 'Matrices 15 minutos' }).then((rows) => {
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
    promedio = resultados.map(x => x).filter(x => x[0] == origen)
    calcularIntervalo(promedio[0][2], hora, inicio, fin, cliente)
    return array_datos
  })
}

//////////////////////////////////////////////////////////////////////////////////////////////

function calcularIntervalo (promedio, hora, inicio, fin, cliente) {
  let valor = promedio * 60
  // console.log('valor promedio en minutos', promedio)
  // console.log('valor promedio en segundos', valor)
  valor = fin - valor
  // console.log('inicio en segundos', inicio)
  // console.log('valor final - valor promedio (segundos)', valor)
  // console.log('fin en segundos', fin)
  let intervalo = horas.filter(element => element < hora)
  let contador = 0
  let intervalo_salida = []

  if (valor < inicio) {
    while (valor < inicio) {
      inicio -= 900
      contador++
      intervalo_salida = intervalo[intervalo.length - contador]
      // console.log('contador', contador)
      // console.log('interv', intervalo_salida)
      // console.log('inicio', inicio)
      // console.log('valor', valor)
    }
    cliente.ws.send('Debe salir entre: ' + intervalo_salida)
  } else {
    cliente.ws.send('Debe salir entre: ' + hora)
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////

// PRUEBAS UNITARIAS

module.exports.departureInterval = function () {
  it('La Victoria -> Padre Anchieta - La Laguna, Hora prevista de llegada: 7:30 - 7:45 ', done => {
    expect(calcularIntervaloPrueba(32.80888889, '7:30 - 7:45', 1800, 2700)).toEqual('7:00 - 7:15')
    done();
  })
  it('Los Realejos -> Camino La Hornera - Santa Cruz de Tenerife, Hora prevista de llegada: 7:30 - 7:45', done => {
    expect(calcularIntervaloPrueba(65.20555556, '7:30 - 7:45', 1800, 2700)).toEqual('6:30 - 6:45')
    done();
  })
  it('La Cuesta de la Villa -> Guajara, Hora prevista de llegada: 8:00 - 8:15', done => {
    expect(calcularIntervaloPrueba(14.01715686, '8:00 - 8:15', 0, 900)).toEqual('8:00 - 8:15')
    done();
  })
  it('Los Naranjeros - Tacoronte -> Aeropuerto Tenerife Norte, Hora prevista de llegada: 8:30 - 8:45', done => {
    expect(calcularIntervaloPrueba(4.194444444, '8:30 - 8:45', 1800, 2700)).toEqual('8:30 - 8:45')
    done();
  })
  it('La Matanza -> Guajara, Hora prevista de llegada: 8:15 - 8:30', done => {
    expect(calcularIntervaloPrueba(21.46746032, '8:15 - 8:30', 900, 1800)).toEqual('8:00 - 8:15')
    done();
  })
  it('Polígono San Nicolás -> Padre Anchieta - La Laguna, Hora prevista de llegada: 8:45 - 9:00', done => {
    expect(calcularIntervaloPrueba(33.60263158, '8:45 - 9:00', 2700, 3600)).toEqual('8:15 - 8:30')
    done();
  })
}

//////////////////////////////////////////////////////////////////////////////////////////////

// MÉTODO PARA PRUEBAS UNITARIAS

function calcularIntervaloPrueba (promedio, hora, inicio, fin) {
  let valor = promedio * 60
  valor = fin - valor
  let intervalo = horas.filter(element => element < hora)
  let contador = 0
  let intervalo_salida = []
  let resultado

  if (valor < inicio) {
    while (valor < inicio) {
      inicio -= 900
      contador++
      intervalo_salida = intervalo[intervalo.length - contador]
    }
    resultado = intervalo_salida
  } else {
    resultado = hora
  }
  return resultado
}

//////////////////////////////////////////////////////////////////////////////////////////////

wss.on('connection', function (websocket) {
  websocket.on('close', function (websocket) {
    console.log("Client Disconnected!")
  })
  let id_salida, id_destino
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