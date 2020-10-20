var nuevoId;
var db=openDatabase("itemDB","1.0","itemDB", 65535)

function limpiar(){  //limpiar los valores
    document.getElementById("item").value="";
    document.getElementById("precio").value="";
}

//funcionalidad de los botones
//eliminar Registro
function eliminarRegistro(){
    $(document).one('click','button[type="button"]', function(event){
        let id=this.id;
        var lista=[];
        $('#listaProductos').each(function(){
            var celdas=$(this).find('tr,Reg_A'+id);
            celdas.each(function(){
                var registro=$(this).find('span.mid');
                registro.each(function(){
                    lista.push($(this).html())
                });
            });
        });
        nuevoId=lista[0].substr(1);
        db.transaccion(function(transaccion){
            var sql="DELETE FROM productos WHERE id="+nuevoId+";"
            transaction.executeSql(sql,undefined,function(){
                alert("Registro borrado satisfactoriamente, por favor actualice la tabla")
            }, function(transaction, err){
                alert(err.message);
            })
        })
    })
}

$(function(){
// funcion para crear la tabla de productos
    $("#crear").click(function(){
        db.transaction(function(transaction){
            var sql="CREATE TABLE productos "+
            "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "+
            "item VARCHAR(100) NOT NULL, "+
            "precio DECIMAL(5,2) NOT NULL)";
            transaction.executeSql(sql,undefined, function(){
                alert("Tabla creada satisfactoriamente");
            }, function(transaction, err){
                alert(err.message);
            })
            });
    });
    //cargar la lista de productos
    $("#listar").click(function(){
        cargarDatos();
    })

    //funcion para listar y pintar la tabla de productos en la pagina web
    function cargarDatos(){
        $("#listaProductos").children().remove();
        db.transaction(function(transaction){
            var sql="SELECT * FROM productos ORDER BY id DESC";
            transaction.executeSql(sql,undefined, function(transaction,result){
                if(result.rows.length){
                    $("#listaProductos").append('<tr><th>Codigo</th><th>Producto</th><th>Precio</th><th></th><th></th></tr>');
                    for(var i=0; i<result.rows.length; i++){
                        var row = result.rows.item(i);
                        var item = row.item;
                        var id = row.id;
                        var precio = row.precio;
                        $("#listaProductos").append('<tr id="fila'+id+'" class="Reg_A'+id+'"><td><span class="mid">A'+
                        id+'</span></td><td><span>'+item+'</span></td><td><span>'+ 'USD '+
                        precio+ '</span></td><td><button type="button" id="A'+id+'" class="btn btn-success"><img src="libs/img/editar.png" /></button></td><td><button type="button" id="A'+id+'" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png" /></button><td></tr>');
                    }
                } else {
                    $("#listaProductos").append('<tr><td colspan="5" align="center">No existen registros de productos</td></tr>');
                }
                },function(transaction, err){
                    alert(err.message);
                })
        
            })
    }



    //insertar registros
    $("#insertar").click(function(){
    var item = $("#item").val();
    var precio = $("#precio").val();
    db.transaction(function(transaction){
        var sql = "INSERT INTO productos (item,precio) VALUES(?,?)";
        transaction.executeSql(sql,[item,precio],function(){
        }, function(transaction, err){
            alert(err.message);
        })
    })
        limpiar();
        cargarDatos();
    })

    //para borrar toda la lista de registros
    $("#borrarTodo").click(function(){
        if(!confirm("Estás seguro de borrar toda la tabla? Los datos se perderar permanentemente",""))
            return;
        db.transaction(function(transaction){
            var sql="DROP TABLE productos";
            transaction.executeSql(sql,undefined, function(){
                alert("Tabla borrada satisfactoriamente. Por favor actualizar la página")
            }, function(transaction, err){
                alert(err.message);
            })   
        })
    })



})
