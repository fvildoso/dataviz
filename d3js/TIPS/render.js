import * as d3 from 'd3';
import * as jsdom from 'jsdom';
import * as fs from 'fs';

// const doSomething = require('./doSomething.js');

const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
// global.document = document;

var body = d3.select(document).select("body");

const svg =body
    .append('svg')
    .attr('width',450)
    .attr('height',400)

const rect = svg
    .append('rect')
    .attr('id','rectangulo')
    .attr("width", 100)
    .attr("height", 100)
    .attr("rx", 20)
    .attr("x", 0)
    .attr("y", 200);

rect
    .transition()
    .duration(4000)
    .attr("x", 400)
    .attr("y", 200)
    .style("fill", () => d3.interpolateTurbo(Math.random()))


// svg.append("line")
//     .attr("x1", 100)
//     .attr("y1", 100)
//     .attr("x2", 200)
//     .attr("y2", 200)
//     .style("stroke", "rgb(255,0,0)")
//     .style("stroke-width", 2);
//
// fs.writeFileSync("test.svg", body.node().innerHTML)


var svg = svg_main.select("svg"),
    canvas = document.createElement("canvas"),
    width = canvas.width = +svg.attr("width"),
    height = canvas.height = +svg.attr("height"),
    context = canvas.getContext("2d");

var projection = d3.geoOrthographic()
    .scale(195)
    .translate([width / 2, height / 2])
    .precision(0.1);

var path = d3.geoPath().projection(projection);

d3.json("/mbostock/raw/4090846/world-110m.json", function(err, world) {
    var data = [],
        stream = canvas.captureStream(),
        recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorder.ondataavailable = function(event) {
        if (event.data && event.data.size) {
            data.push(event.data);
        }
    };

    recorder.onstop = () => {
        var url = URL.createObjectURL(new Blob(data, { type: "video/webm" }));
        d3.selectAll("canvas, svg").remove();
        d3.select("body")
            .append("video")
            .attr("src", url)
            .attr("controls", true)
            .attr("autoplay", true);
    };

    var background = svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#fff");

    svg.append("path")
        .datum({ type: "Sphere" })
        .attr("stroke", "#222")
        .attr("fill", "none");

    svg.append("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("fill", "#222")
        .attr("stroke", "none");

    svg.append("path")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
            return a !== b;
        }))
        .attr("fill", "none")
        .attr("stroke", "#fff");

    var queue = d3.queue(1);

    d3.range(120).forEach(function(frame){
        queue.defer(drawFrame, frame / 120);
    });

    queue.awaitAll(function(err, frames){
        recorder.start();
        drawFrame();

        function drawFrame() {
            if (frames.length) {
                context.drawImage(frames.shift(), 0, 0, width, height);
                requestAnimationFrame(drawFrame);
            } else {
                recorder.stop();
            }
        }
    });


});


function drawFrame(svg) {
    const img = new Image(),
        serialized = new XMLSerializer().serializeToString(svg.node()),
        url = URL.createObjectURL(new Blob([serialized], {type: "image/svg+xml"}));

    img.onload = function(){
        cb(null, img);
    };

    img.src = url;
}