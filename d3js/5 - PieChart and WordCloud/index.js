// leemos la data
d3.csv("worddata.csv")
    .then(function (d) {

        //podemos revisar por consola los datos
        console.log(d)

        dataViz_piechart(d);
        dataViz_wordcloud(d);
    })

//piechart
function dataViz_piechart(data) {

    //obtenemos un array solo con las frecuencias
    const frecuencias = [];
    data.forEach(function (element) {
        frecuencias.push(element.frequency);
    });
    console.log("Frecuencias")
    console.log(frecuencias)

    //escala con colores
    //https://github.com/d3/d3-scale-chromatic#schemePaired
    console.log("Colores");
    const colorScale = d3.scaleOrdinal(d3.schemePaired);
    console.log(d3.schemePaired);
    console.log(colorScale(1))
    console.log(colorScale(100))

    //piechart
    console.log("PieChart");
    //https://github.com/d3/d3-shape
    let pieChart = d3.pie()(frecuencias);
    console.log(pieChart);

    //lo mismo de siempre
    //notar que le damos el piechart
    //el atributo d, dibuja necesita que le demos un arco
    d3.select("#piechart")
        .append("g")
        .attr("transform", "translate(300,300)")
        .selectAll("path")
        .data(pieChart).enter()
        .append("path")
        .attr("id", function (d, i) {
            return "torta_" + i;
        })
        .attr("d",
            d3.arc()
                .outerRadius(function () {
                    return 100;
                })
                .innerRadius(50)
        )
        .style("fill", function (d, i) {
            return colorScale(i)
        })
        .style("opacity", .5)
        .style("stroke", "black")
        .attr("transform", "rotate(180)")
        .style("stroke-width", "2px");

    // nos comemos una parte de la torta
    //d3.select("#torta_1").remove()
}

//wordcloud
//text,frequency
//https://github.com/jasondavies/d3-cloud
function dataViz_wordcloud(data) {
    //creamos una escala para las fuentes y frecuencias
    const wordScale = d3.scaleLinear().domain([0, 100]).range([0, 200]);

    //servirá despues
    const keywords = ["layout", "zoom", "circle", "style", "append", "attr"]

    //le pasamos la data en words
    //usamos la escala para "normalizar" los tamaños
    //le asignamos un nuevo campo size
    //dibujamos cuando termina de inicializar
    //draw tendrá asignada los datos
    d3.layout.cloud().size([600, 600])
        .words(data)
        .rotate(function (d) {
            return 0;
        })
        .fontSize(function (d) {
            return wordScale(d.frequency);
        })
        .padding(1)
        .on("end", draw)
        .start();

    //funcion que dibuja
    function draw(words) {
        console.log("Words: ");
        console.log(words);

        //seleccionamos el svg cloud y agregamos un g
        //notar que tenemos que trasladar el grupo
        const wordG = d3.select("#cloud")
            .append("g")
            .attr("id", "wordCloudG")
            .attr("transform", "translate(300,300)");

        //agregamos cada palabra
        //https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        wordG.selectAll("text.miclase")
            .data(words).enter()
            .append("text")
            .style("font-size", function (d) {
                //console.log(d);
                return d.size + "px";
                //return parseInt(d.frequency) + "px";
            })
            .style("fill", function (d) {

                return "black"
                // return (keywords.indexOf(d.text) > -1 ? "red" : "black");

                // if (keywords.indexOf(d.text) > -1) {
                //     return 'red';
                // } else {
                //     return 'black';
                // }

            })
            .style("opacity", .75)
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            // .attr("transform", function(d) {
            // 	return d.text.length > 5 ? "translate(" + [d.x, d.y] + ")rotate(" + 0 + ")" : "translate(" + [d.x, d.y] + ")rotate(" + 90 + ")";;
            // })
            .text(function (d) {
                return d.text;
            });
    }

}