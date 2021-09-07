//genera random entre dos enteros
function azar(x, y) {
    return Math.floor(Math.random() * y) + x
}

//aqui se hacen cosas locas 👀
function transiciones() {

    //definimos algunas constantes a utilizar
    const lado = 100;
    const radio = lado * Math.sqrt(2) / 2;
    const w = 100;
    const h = 100;
    const separacion = 50;
    const colores = ["purple", "red", "black", "green"];

    //añadimos el circulo
    d3.select("#viz_2").select("svg")
        .append("circle")
        .attr("class", "circle_blanco")
        .attr("r", radio)
        .attr("fill", "black")
        .attr("cx", 100)
        .attr("cy", 100);

    //hacemos un grupo dejar ahi lo que queremos mover dentro de si mismo
    const container =
        d3.select("#viz_2")
            .select("svg")
            .append("g")
            .attr("transform", "translate(" + (separacion + w / 2) + "," + (separacion + h / 2) + ")");

    //agregamos un rect al container
    container
        .append("rect")
        .attr("id", "rectHoli2")
        .attr("fill", "red")
        .attr("width", lado)
        .attr("height", lado)
        .attr("rx", 20)
        .attr("x", -lado / 2)
        .attr("y", -lado / 2);

    //variable a utilizar espues
    let delta = 0;

    //hacemos una transicion con el rect
    d3.select("#rectHoli2")
        .transition()
        .duration(500) //tiempo en milisegundos que queremos que dure la transicion
        .ease(d3.easeLinear) //agregamos esto si queremos que la transicion ocurra de forma lineal
        .on("start", function repeat() {
            delta = delta + 20; //actualizamos la variable

            d3.active(this) //hacemos algo sobre lo que estamos moviendo
                .attr("transform", function () {
                    //hacemos una rotacion y scalamiento
                    return "rotate(" + 0 + delta + ") scale(" + azar(5, 20) / 10 + ")";
                })
                .attr("fill", colores[azar(0, 3)]) //usamos algun color al azar
                .attr("rx", azar(0, 100)) // cambiamos el radio de los vertices del rect
                .transition()
                .duration(azar(5, 15) * 100) //hacemos que la proxima transicion sea al azar
                .on("start", repeat); //volvemos a hacer esto mismo
        });

    //aqui le damos moviemiento al container
    container
        .transition()
        .duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attr("transform", function () {
                    return "translate(" + (separacion + w / 2 + azar(0, 800)) + " ," + (separacion + azar(0, 100) + h / 2) + ")";
                })
                .transition()
                .duration(2000)
                .on("start", repeat);
        })
}

//usamos la funcion
transiciones();

