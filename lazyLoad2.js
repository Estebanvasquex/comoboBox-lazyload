import { datos } from "./datos.js";

/*var datos_finales = datos.map(function (item, index) {
  return { id: item.codigo_predio, text: item.codigo_ficha };
});*/

$(document).ready(function () {
  $("#select3").select2({ data: datos_finales });
});

//Carga de métodos incluidos en select2
function cargarDatosSelect2({
  datos = [],
  idSelect,
  primaryKey = "codigo_predio",
  label = "codigo_ficha",
  pageSize_ = 100,
  placeholder_ = "Seleccione",
}) {
  var resultSearch = []; // Array para guardar la busqueda en tiempo real
  var results = []; // Array para guardar la paginacion
  var datoInicial = [{ id: "0", text: placeholder_ }];

  if (!datos || !idSelect || !primaryKey || !label) return;
  if (!document.getElementById(idSelect?.replace("#", ""))) return;
  var datos_finales = datos
    .map(function (item, index) {
      if (!item[primaryKey] || !item[label]) return { remove: true };
      return { id: item[primaryKey], text: item[label] };
    })
    .filter((item) => !item.remove);

  datos_finales.unshift(datoInicial[0]);//Agrega el placeholder al inicio del array

  console.log(datos_finales);

  //Carga de métodos incluidos en select2

  $.fn.select2.amd.require(
    ["select2/data/array", "select2/utils"],
    function (ArrayData, Utils) {
      function CustomData($element, options) {
        CustomData.__super__.constructor.call(this, $element, options);
      }
      //Función utilizada para buscar registros, realiza la busqueda por cada letra escrita
      function matchStart(params, data) {
        var filteredChildren = [];
        $.each(data, function (idx, child) {
          if (child.text.indexOf(params.toUpperCase()) > -1) {
            filteredChildren.push(child);
          }
        });
        if (filteredChildren.length > 0) {
          resultSearch = filteredChildren;
        }
      }

      //Método para crear la paginacion e ir cargando al DOM los registros
      Utils.Extend(CustomData, ArrayData);
      CustomData.prototype.query = function (params, callback) {
        if (!("page" in params)) {
          params.page = 1;
        }

        var pageSize = pageSize_; //Cantidad de registros a cargar al cargar por primera vez y al hacer scroll en el dropdown

        if (typeof params.term !== "undefined") {
          matchStart(params.term, datos_finales);
        }

        //crea array con la paginacion especificada
        resultSearch.length > 0
          ? (results = resultSearch)
          : (results = datos_finales);
        callback({
          results: results.slice(
            (params.page - 1) * pageSize,
            params.page * pageSize
          ),

          pagination: {
            more: results.length >= params.page * pageSize,
          },
        });
      };
      //Implemetación de los datos en el select2
      $(idSelect).select2({
        placeholder: placeholder_,
        dataAdapter: CustomData,
      });
    }
  );
}

cargarDatosSelect2({ datos: datos, idSelect: "#select" });
