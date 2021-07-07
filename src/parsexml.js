var fs = require('fs');
var parse = require('xml-parser');
var xml = fs.readFileSync('tripinfo.xml', 'utf8');
var inspect = require('util').inspect;
// var obj = parse(xml);

// function convertToJSON () {
//   var obj = parse(xml);
//   fs.writeFile ("tripinfo.json", inspect(obj, { colors: true, depth: Infinity }), function(err) {
//     if (err) throw err;
//       console.log('complete');
//     }
//   )
// }
var obj = parse(xml)
var objeto = convertirXmlEnObjeto(obj);

function convertirXmlEnObjeto(xml) {

  var objeto = {};
  var esRaiz = false;

  //  Objeto "raiz"
  if (xml.nodeType == 1) { // Objeto 
      // Se recuperan sus atributos
      if (xml.attributes.length > 0) {
          for (var j = 0; j < xml.attributes.length; j++) {
              var atributo = xml.attributes.item(j);
              objeto[atributo.nodeName] = atributo.nodeValue;
          }
      }
  } else if (xml.nodeType == 3) { // Texto
      objeto = xml.nodeValue;
  } else if (xml.nodeType == 9) { // Elemento raiz
      esRaiz = true;
  }

  // Atributos del objeto (objetos hijos)
  if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
          var item = xml.childNodes.item(i);
          var nombreNodo = item.nodeName;

          // Si objeto no tiene un atributo con el nombre nombreNodo se anade, si ya lo tiene (es un array) se anade
          // a la lista del objeto con nombre nombreNodo
          if (typeof(objeto[nombreNodo]) == "undefined") {
              // Si el elemento es un CDATA se copia el contenido en el elemento y no se crea un
              // hijo para almacenar el texto
              if (nombreNodo == "#cdata-section") {
                  objeto = item.nodeValue;
              } else if (nombreNodo == "#text") { // Si el elemento es un texto no se crea el objeto #text
                  if (item.childNodes.length < 1) {
                      objeto = item.nodeValue;
                  } else {
                      objeto[nombreNodo] = convertirXmlEnObjeto(item);
                  }
              } else {
                  if (esRaiz) {
                      objeto = convertirXmlEnObjeto(item);
                  } else {
                      objeto[nombreNodo] = convertirXmlEnObjeto(item);
                  }
              }
          } else {
              // Si el atributo no es una lista se convierte el atributo en un array y se anade el
              // valor a dicho array
              if (typeof(objeto[nombreNodo].push) == "undefined") {
                  var valorAtributo = objeto[nombreNodo];
                  objeto[nombreNodo] = new Array();
                  objeto[nombreNodo].push(valorAtributo);
              }

              objeto[nombreNodo].push(convertirXmlEnObjeto(item));
          }
      }
  }
  
  return objeto;
}