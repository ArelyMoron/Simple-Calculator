"use strict"

// Elaborado por Zaide Arely Moron Torres

var TxtCalc;
var TxtCalc_2;

function Start() // aqui hago las instancias para acceder a los textbox
{
    TxtCalc = document.getElementById("txt_calc"); // este textbox es en el que el usuario introduce los datos
    TxtCalc_2 = document.getElementById("txt_calc2"); // este lo ocupo para mostrar al usuario la operacion que se realizo
}

function OnKeyEnter(event) // evento que se produce cuando se presiona una tecla, y checo si esa tecla es enter
{
    if(event.keyCode === 13 && !event.shiftKey)
    {
        event.preventDefault();
        Onclick_equal(); // si es la tecla enter lanzo la funcion de la tecla igual, para resolver lo que el usuario haya introducido
    }
}

function OnkeyBackspace(event) // lo mismo que el anterior, solo que lo hize con el evento keyup ya que no me detectaba la tecla backspace con el evento keypress
{
    if(event.keyCode === 8 && !event.shiftKey)
    {
        event.preventDefault();
        Onclick_delete(); // cuando se presiona la tecla backspace llamo a la funcion del metodo borrar
    }
}

function Onclick_addNum(value) // este evento se produvce al dar click a algun boton con el cual se tenga que mostrar algo en la pantalla de la calculadora
{
    // se realizan las comprobaciones para asegurarme de que los datos introducidos esten correctos
    if(TxtCalc.value === "Error" || TxtCalc.value === "Infinity")
    {
        TxtCalc.value = "";
        TxtCalc_2.value = "";
    }

    if(value === ".")
    {
        if(TxtCalc.value === "")
        {
            TxtCalc.value += "0.";
        }
    
        else if(TxtCalc.value.indexOf(".") === -1 )
        {
            TxtCalc.value += ".";
        }
        else
        {
            TxtCalc.value += "";
        }
    }

    else if(value === "0")
    {
        if(TxtCalc.value.indexOf("0", 0) != 0 || TxtCalc.value.indexOf(".") != -1)
        {
            TxtCalc.value += value;
        }
    }

    else if(isSymbol(value)) // si es un simbolo checo el caracter anterior para impedir colocar 2 simbolos juntos
    {
        if(TxtCalc.value[TxtCalc.value.length - 1] != value && !isSymbol(TxtCalc.value[TxtCalc.value.length - 1]) && TxtCalc.value.length > 0)
        {
            TxtCalc.value += value;
        }
    }

    else
    {
        if(TxtCalc.value === "0")
        {
            TxtCalc.value = value;
        }

        else
        {
            TxtCalc.value += value;
        }
    }
}

function Onclick_delete() // aqui se borran los datos introducidos uno por uno
{
    if(TxtCalc.value === "Error" || TxtCalc.value === "Infinity") // combpruebo si lo que mostro no es un error o un infinito
    {
        Onclick_deleteAll();
        return;
    }

    if(TxtCalc_2.value != "") // si el 2do textbox tiene datos entonces se los copio al 1er textbox y los borro, con el fin de que el usuario pueda editar la operacion realizada 
    {
        TxtCalc.value = TxtCalc_2.value;
        TxtCalc_2.value = "";
    }

    else
    {
        TxtCalc.value = TxtCalc.value.substring(0, TxtCalc.value.length - 1); // borro el ultimo dato introducido
    }
}

function Onclick_deleteAll() // borro todos los datos introducidos
{
    TxtCalc.value = "";
    TxtCalc_2.value = "";
}

function Onclick_equal() // aqui resuelvo las operaciones que el usuario indico
{
    if(TxtCalc.value.indexOf("%") != -1) // primero checo si hay un simbolo de porcentaje para resolver este primero
    {
        /*
        la idea para esto es primero obtener la poscion del simbolo de porcentaje en el texto introducido por el usuario
        manejando este como un string, y tambien obtener si es que se encuentra un simbolo de operacion (+, -, *, /) antes y obtener si es asi su poscion;
        todo esto con el fin de dividir la cadena y sacar el numero que representaria la cantidad del porcentaje que desea sacar el usuario y tambien la cantidad
        a la que se desea sacar ese porcentaje
        */
        let aux = TxtCalc.value.substring(0, TxtCalc.value.indexOf("%")); // obtengo una cadena nueva sin el simbolo de porcentaje
        let index = searchSymbol(aux); // obtengo la posision donde se encuentra algun simbolo de operacion
        if(index != -1) // si se encuentra un simbolo de operacion antes del porcentaje
        {
            let number = extractNumber(aux, index); // obtengo el numero al cual voy a sacar el porcentaje
            let percent = extractPercent(aux, index); // obtengo la cantidad del porcentaje deseado
            let resul = calcPercent(number, percent); // hago el calculo del porcentaje 
            TxtCalc.value = TxtCalc.value.substring(0, index + 1).concat(resul); // quito de la cadena toda la operacion que realize y la remplazo por el resultado
            Onclick_equal(); // vuelvo a llamar a esta misma funcion por si se tiene que realizar alguna otra operacion
        }
        
        else // si en la cadena no hay ningun tipo de simbolo de operacion antes del porcentaje entonces solo obtengo la cantidad que representa ese porcentaje
        {
            TxtCalc_2.value = TxtCalc.value;
            TxtCalc.value = aux / 100;
        }
    }
    else if(TxtCalc.value != "") // aqui ya se realizan todas las demas operaciones una vez resuelto lo del porcentaje
    {
        TxtCalc_2.value = TxtCalc.value;
        let aux = eval(TxtCalc.value); // para realizar las operaciones indicadas por el usuario ocupo la funcion eval de javascript que me devuelve el resultado de la operacion que se le indique
        if(isNaN(aux))
        {
            TxtCalc.value = "Error";
            TxtCalc_2.value = "";
        }

        else
        {
            TxtCalc.value = aux;
        }
    }
}

function Onclick_changeSign() // esto es para poner numeros negativos o bien cambiar el simbolo del primer numero introducido
{
    if(TxtCalc.value.indexOf("%") === -1) // checo si no hay un simbolo de porcentaje y si lo hay no dejo cambiar el simbolo ya que no hay porcenytajes de numeros negativos
    {
        if(TxtCalc.value.substring(0, 1) === "-")
        {
            TxtCalc.value = TxtCalc.value.substring(1, TxtCalc.value.length);
        }
    
        else
        {
            TxtCalc.value = "-".concat(TxtCalc.value);
        }
    }
}

// las funciones de abajo son las que utilizo como auxiliares en los eventos

function isSymbol(text) // checo si el caracter es algun tipo de simbolo
{
    if(text === "+" || text === "-" || text === "*" || text === "/" || text === "%")
    {
        return true;
    }

    else
    {
        return false;
    }
}

function isOperator(text) // checo si el caracter no es algun simbolo de operacion
{
    if(text === "+" || text === "-" || text === "*" || text === "/")
    {
        return true;
    }

    else
    {
        return false;
    }
}

function extractPercent(input, i) // extraigo la cantidad del porcentaje, la idea de esto se explica en la funcion "Onclick_equal"
{
    return input.substring(i + 1, input.length);
}

function extractNumber(input, i) // extraigo el numero al cual sacar el porcentaje, la idea de esto se explica en la funcion "Onclick_equal"
{
    return input.substring(0, i);
}

function searchSymbol(input) // busco en la cadena la poscion de algun simbolo de operacion antes del porcentaje, la idea de esto se explica en la funcion "Onclick_equal"
{
    for(var i = 0; i < input.length; i++)
    {
        if(isOperator(input[i]))
        {
            return i;
        }
    }

    return -1;
}

function calcPercent(number, percent) // calculo el porcentaje de un numero
{
    return (percent / 100) * number;
}