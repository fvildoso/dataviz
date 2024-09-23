const svg = d3.select("svg")

let imagenes = [
    "pez-azul.png",
    "pez-blanco.png",
    "pez-dorado.png",
    "pez-negro.png",
]

let factor = 300

let posiciones_circle = []

for (let i = 0; i < 20; i++) {
    posiciones_circle.push({cx:Math.random()*factor+ 20, cy:Math.random()*factor + 20, r:Math.random()*10});
}

//burbujas
svg.append("g")
    .selectAll('circle')
    .data(posiciones_circle)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return d.cx
    })
    .attr("cy", function (d) {
        return d.cy
    })
    .attr("r", function (d) {
        return d.r
    })
    .attr('fill',"blue")

//peces
svg.append("g")
    .selectAll('.peces')
    .data(d3.range(15)) //posiciones con range
    .enter()
    .append("g")
    .attr("transform", function () {
        //hacemos una rotacion y scalamiento
        return `translate(${Math.random()*factor + 50},${Math.random()*(factor-100) + 50}) scale(${Math.random()* 0.5 + 0.75})`;
    })
    .attr("class", "g_peces")
    .append("svg:image")
    .attr("class", "peces")
    .attr('height', 50)
    .attr('width', 50)
    .attr("xlink:href", function(d, i){
        return imagenes[i % imagenes.length]
    })
    .style("opacity",0)

d3.selectAll(".peces")
    .transition()
    .duration(1000)
    .delay(function (d, i) {
        return 100 * i
    })
    .style("opacity",1)

d3.selectAll(".g_peces")
    .transition()
    .duration(2000) //tiempo en milisegundos que queremos que dure la transicion
    .ease(d3.easeLinear) //agregamos esto si queremos que la transicion ocurra de forma lineal
    .delay(function (d, i) { //hacemos que los peces no se muevan al mismo tiempo
        return Math.random()*1000
    })
    .on("start", function repeat() {

        d3.active(this) //hacemos algo sobre lo que estamos moviendo
            .attr("transform", function () {
                //hacemos una rotacion y scalamiento
                return `translate(${Math.random()*factor + 25},${Math.random()*(factor-100) + 50}) scale(${Math.random()* 0.5 + 0.75})`;
            })
            .transition()
            .duration(2000)
            .delay(function (d, i) {
                return Math.random()*1000
            })
            .ease(d3.easeLinear)//hacemos que la proxima transicion sea al azar
            .on("start", repeat); //volvemos a hacer esto mismo
    });

d3.selectAll("circle")
    .transition()
    .duration(4000)
    .attr("cy",0)

