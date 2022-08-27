//aquí se hacen cosas locas 👀
function transiciones() {

    let delta = 0;
    const svg = d3.select("#viz_2").select("svg")

    const fantasmita = svg.append("svg:image")
        .attr('width', 100)
        .attr('height', 104)
        .attr("xlink:href", "../assets/fantasmita.png")

    const centro = getBoundingBoxCenter(svg)
    console.log(centro)

    fantasmita
        .transition()
        .duration(2000)
        .attr("transform", function () {
            return "translate(200, 0)";
        })
        .transition()
        .duration(50)
        .attr("transform", function () {
            return "translate(200, 0) rotate(" + delta + "," + centro[0] + "," + centro[1] + ") ";
        })
}

transiciones()

function getBoundingBoxCenter(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    const element = selection.node();
    // use the native SVG interface to get the bounding box
    const bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
}

