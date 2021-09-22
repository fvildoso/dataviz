// leemos la data y la mandamos al callback, en este caso do_something()
d3.csv("avocado.csv")
    .then(function (data) {
        do_something(data)
    })

//definimos nuestra funcion
function do_something(incomingData) {

    //https://observablehq.com/@d3/d3-group
    const nested = d3.group(incomingData, d => d.region) //en v4 habia una funcion nested que servia para agrupar tmb

    console.log("Nested: ");
    console.log(nested);

    //un array vacio
    let data = [];

    //iteramos sobre cada "grupo" en nested
    nested.forEach(function (d, i) {

        //buscamos el maximo del lugar
        const max = d3.max(d, function (item) {
            return +item.AveragePrice
        });

        //buscamos el minimo
        const min = d3.min(d, function (el) {
            return +el.AveragePrice
        });

        //buscamos el promedio
        const mean = d3.mean(d, function (el) {
            return +el.AveragePrice
        });

        //creamos un objeto con el nombre de la ciudad, maximo, minimo y promedio, para luego guardarlo en data
        //el i tiene el indice como siempre
        data.push({city: i, max_average: max, min_average: min, mean_average: mean})
    });

    //creamos g por cada data que nos llega
    d3.select("#viz_1").select("svg") //seleccionamos svg del primer div
        .append("g")  //añadidmos un g con los atributos que especificamos
        .attr("id", "grupoCirculos")
        .attr("transform", "translate(50,150)")
        .selectAll("g") //seleccionamos todos los g dentro del g que creamos arriba
        .data(data) //unimos con la data
        .enter().append("g") //añadimos un g por cada data que quedó solita
        .attr("class", "grupoCirculo") //clase del g que creamos arriba
        .attr("transform", function (d, i) {
            return "translate(" + (i * 60) + ", 0)" //trasladamos los g
        });

    //seleccionamos los reviews
    let grupoCirculo = d3.selectAll("g.grupoCirculo");

    //añadimos un circulo a cada grupo
    grupoCirculo.append("circle")
        .attr("r", function (d) {
            return d.mean_average * 10; //usamos el promedio para el radio del circulo
        });

    //agregamos un label con el nombre de la ciudad
    grupoCirculo
        .append("text")
        .style("text-anchor", "middle") //donde fijamos el origen puede ser start, middle o end
        .attr("y", 30) //esta posicion es dentro del grupo
        .text(function (d) {
            return d.city //usamos el nombre de la ciudad que viene en el objeto
        });

    //keys recorre las key de un objeto, usamos el primero pero podemos usar cualquiera
    const dataKeys = Object.keys(data[0]) //v4 hay otra forma de hacerlo
        .filter(function (el) {
            return el !== "city"
        });
    console.log(dataKeys)

    d3.select("#controls") //seleccionamos elemento con id controls
        .selectAll("button.boton") //seleccionamos todos los botones con clase boton
        .data(dataKeys) //usamos las llaves detectadas antes
        .enter().append("button") //agregamos un boton por cada data que quedo solita
        .on("click", buttonClick) //hacemos que se ejecute buttonClick cuando se le haga click
        .html(function (d) {
            return d //esto es lo que va en el texto del boton, usamos las mismas keys
        });

    function buttonClick(d) {
        console.log(d)
        //d contiene el elemento que se le hizo click, pueden hacer un console log para ver lo que contiene
        //d.target.__data__ tiene la data asociada al elemento d

        //obtenemos el maximo valor
        const maxValue = d3.max(data, function (el) {
            return parseFloat(el[d.target.__data__])
        });

        //creamos una escala de colores por segmento
        const colorQuantize = d3.scaleQuantize()
            .domain([0, maxValue])
            .range(colorbrewer.PuOr[6]);

        //creamos una escala lineal para los radios
        const radiusScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([2, 100]);

        //agregamos una transicion entre la forma original y la nueva
        d3.selectAll("g.grupoCirculo")
            .select("circle")
            .transition()
            .duration(1000)
            .attr("fill", function (p) {
                return colorQuantize(p[d])
            })
            .attr("r", function (p) {
                return radiusScale(p[d.target.__data__])
            });
    }

    //effectos con el mouse, abajo definimos las funciones
    grupoCirculo.on("mouseover", highlightRegion);
    grupoCirculo.on("mouseout", unHighlight);

    function highlightRegion(d) {
        const teamColor = d3.rgb("pink");

        d3.select(this)
            .select("text")
            .classed("highlight", true)
            .attr("y", 10);

        d3.selectAll("g.grupoCirculo")
            .select("circle")
            .style("fill", function (p) {
                return p.city === d.city ? teamColor.darker(.75) : teamColor.brighter(.5)
            })
    }

    function unHighlight() {
        d3.selectAll("g.grupoCirculo")
            .select("circle")
            .style("fill", "purple")
            .style("stroke", "black");

        d3.selectAll("g.grupoCirculo")
            .select("text")
            .attr("y", 30)
            .classed("highlight", false);
    }

    //agregamos la funcion reviewClick a cada g.grupoCirculo
    d3.selectAll("g.grupoCirculo")
        .on("click", circleClick);

    //cargamos el archivo modal
    d3.text("modal.html")
        .then(function (data) {
            d3.select("body")
                .append("div") //añadimos un div al body
                .attr("id", "modal") //le ponemos id modal, notar que las reglas CSS se las damos en style.css
                .html(data) //cargamos lo que estaba el archivo y lo insertamos como html
        });

    //agregamos la data
    function circleClick(d) {
        console.log(d)

        //quitamos lo que está adentro del div modal
        d3.select("#modal")
            .html("");

        //agregamos una nueva tablita con el codigo que está abajo
        d3.select("#modal")
            .append()
            .html('<table>' +
                '<tr><th>Tablita</th></tr>' +
                '<tr><td>City</td><td class="data">' + d.target.__data__.city + '</td></tr>' +
                '<tr><td>Max</td><td class="data">' + d.target.__data__.max_average + '</td>' +
                '<tr><td>Min</td><td class="data">' + d.target.__data__.min_average + '</td></tr>' +
                '<tr><td>Mean</td><td class="data">' + d.target.__data__.mean_average + '</td></tr>' +
                '</table>');
    }
}