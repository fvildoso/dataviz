//genera random entre dos enteros
function azar(x, y) {
    return Math.floor(Math.random() * y) + x
}

//aquí se hacen cosas locas 👀
function transiciones() {

    //definimos algunas constantes a utilizar
    const lado = 100;
    const radio = lado * Math.sqrt(2) / 2;
    const w = 100;
    const h = 100;
    const separacion = 50;
    const colores = ["purple", "red", "black", "green"];

    //añadimos el circulo
    const circle1 = d3.select("#viz_2").select("svg")
        .append("circle")
        .attr("id", "circle1")
        .attr("class", "circle_blanco")
        .attr("r", radio)
        .attr("cx", 100)
        .attr("cy", 100);

    const circle2 = d3.select("#viz_2").select("svg")
        .append("circle")
        .attr("id", "circle2")
        .attr("r", radio)
        .attr("cx", 100)
        .attr("cy", 100);

    //variable a utilizar después
    let delta = 0;

    function repeat() {
        delta = delta + 20; //actualizamos la variable

        d3.active(this) //hacemos algo sobre lo que estamos moviendo
            .attr("transform", function () {
                //hacemos una rotacion y scalamiento
                return "translate(" + (separacion + w / 2 + azar(0, 500)) + " ," + (separacion + azar(0, 100) + h / 2) + ")" +
                    "rotate(" + 0 + delta + ") scale(" + azar(5, 20) / 10 + ")";
            })
            .attr("rx", azar(0, 100)) // cambiamos el radio de los vertices del rect
            .transition()
            .attr("fill", colores[azar(0, 3)]) //usamos algun color al azar
            .duration(azar(5, 15) * 100) //hacemos que la proxima transicion sea al azar
            .on("start", repeat); //volvemos a hacer esto mismo
    }

    circle1.transition().on("start", repeat);
    circle2.transition().on("start", repeat);

}

//usamos la funcion
transiciones();

