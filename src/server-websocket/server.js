let _ = require('underscore')
const xlsxFile = require('read-excel-file/node')
const xlsx = require('xlsx')
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
  let resultados = []
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
  xlsxFile('./preprocesado 6-7.xlsx', { sheet: 'Matrices 15 minutos' }, { defval:" " }).then((rows) => {
    for (i in rows) {
      // for (j in rows[i]) {
        // if (destino.includes('96')) {
        // resultados.push(rows)
      // const found = rows.find(element => element == seconds_one)
      // if (found) {
        console.log(rows[i])
      // }
      // }
      // }
    }
  });
    // const dataExcel = xlsx.utils.sheet_to_json()
    // // console.table(rows)
    // console.log(dataExcel)
    // let XLSX = require('xlsx');
    // const workbook = XLSX.readFile('preprocesado 6-7.xlsx');
    // const sheet_name_list = workbook.SheetNames;
    // let jsonPagesArray = [];
    // sheet_name_list.forEach(function(sheet) {
    //         const jsonPage = {
    //             name: sheet,
    //             content: JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{defval:" "})))
    //         };
    //         jsonPagesArray.push(jsonPage);
    //     });
    // console.log(jsonPagesArray[1].content);
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
  // xlsxFile('./preprocesado 7-8.xlsx', { sheet: 'Matrices 15 minutos' }, { defval:" " }).then((rows) => {
  //   for (i in rows) {
  //     // for (j in rows[i]) {
  //       // if (destino.includes('96')) {
  //       // console.log(rows[i])
  //       // }
  //     // }
  //   }
  // });
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
  // xlsxFile('./preprocesado 8-9.xlsx', { sheet: 'Matrices 15 minutos' }, { defval:" " }).then((rows) => {
  //   for (i in rows) {
  //     // for (j in rows[i]) {
  //       // if (destino.includes('96')) {
  //       // console.log(rows[i])
  //       // }
  //     // }
  //   }
  // });
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