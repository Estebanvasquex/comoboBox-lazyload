import {datos} from './datos.js';



var datos_finales = datos.map(function (item, index) {
    return { id: item.codigo_predio, text: item.codigo_ficha };
});


$(document).ready(function() {
    $('#select3').select2({ data: datos_finales });
});


var resultSearch = [] // Array para guardar la busqueda en tiempo real
var results = []

//Carga de métodos incluidos en select2
$.fn.select2.amd.require(["select2/data/array", "select2/utils"],
	function (ArrayData, Utils) {
		function CustomData($element, options) {
			CustomData.__super__.constructor.call(this, $element, options)
		}
		//Función utilizada para buscar registros, realiza la busqueda por cada letra escrita
		function matchStart(params, data) {
            //console.log(params);
			var filteredChildren = [];
			$.each(data, function (idx, child) {
                //child.text = child.text.toUpperCase()
				if (child.text.indexOf(params.toUpperCase()) > -1) {       
					filteredChildren.push(child)
				}
			})
			if (filteredChildren.length > 0) {
				resultSearch = filteredChildren
			}
		}

		//Método para crear la paginacion e ir cargando al DOM los registros
		Utils.Extend(CustomData, ArrayData)
		CustomData.prototype.query = function (params, callback) {
			if (!("page" in params)) {
				params.page = 1
			}
			var pageSize = 50 //Cantidad de registros a cargar al cargar por primera vez y al hacer scroll en el dropdown

			if (typeof params.term !== 'undefined') {
				matchStart(params.term, datos_finales)
			}
			
			//crea array con la paginacion especificada
			resultSearch.length > 0 ? results = resultSearch : results = datos_finales
			console.log(results);
            callback({
                
				results:results.slice((params.page - 1) * pageSize, params.page * pageSize),
                
				pagination:{
                    
					more:results.length >= params.page * pageSize
				}
			})
		}
		//Implemetación de los datos en el select
		$("#select").select2({
			placeholder: 'Seleccionar una opción',
			ajax:{},
			allowClear: true,
			dataAdapter:CustomData
		})
	}
)