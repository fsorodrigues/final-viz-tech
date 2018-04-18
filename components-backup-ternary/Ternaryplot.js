// importing d3.js
import * as d3 from 'd3';

// importing modules

// importing stylesheets

// setting up modules

// defining Factory function
function Ternary(_) {

    // TO DO: create getter-setter variables in factory scope

    function exports(data) {
        // selecting root element ==> table container, div where function is called in index.js
        const root = this;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const margin = {t:20, r:20, b:20, l:20};
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);
        const side = h * 2 / Math.sqrt(3);

        // data transformation

        // setting up scales
        const sideScale = d3.scaleLinear()
            .domain([0, 0.5])
            .range([0, side]);
        const perpScale = d3.scaleLinear()
            .domain([0, 0.5])
            .range([h, 0]);
        const r = d3.scaleSqrt()
            .range([0, 10])
            .domain([0, d3.max(data, d => d.total)]);
        const scaleColor = d3.scaleLinear()
            .domain([d3.min(data,d => d.year),d3.max(data,d => d.year)])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb('#c40d0d'), d3.rgb('#eee8aa')]);

        // appending canvas to node
        // enter, exit, update pattern
        let canvasUpdate = d3.select(root)
            .selectAll('.canvas')
            .data([1]);
        const canvasEnter = canvasUpdate.enter()
            .append('canvas')
            .classed('canvas', true);
        canvasUpdate.exit().remove();
        canvasUpdate = canvasUpdate.merge(canvasEnter)
            .attr('width', w)
            .attr('height', h)
            .style('margin', `${margin.t}px ${margin.r}px ${margin.b}px ${margin.l}px`);
            // .style('position', 'absolute')
            // .style('top', 0)
            // .style('left', 0);

        // setting drawing context
        let ctx = canvasUpdate.node().getContext('2d');

        // drawing circles for each game
        ctx.beginPath();
        data.forEach(d => {
            ctx.moveTo(sideScale(d.x), perpScale(d.iiiShare));
            // ctx.arc(sideScale(d.x),perpScale(d.iiiShare),r(d.total),0,Math.PI*2);
            ctx.arc(sideScale(d.x),perpScale(d.iiiShare),1,0,Math.PI*2);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgb(255,255,150)';
        ctx.fill();

        // // appending svg to node
        // let svgUpdate = d3.select(root)
        //     .selectAll('.svg')
        //     .data([1]);
        // const svgEnter = svgUpdate.enter()
        //     .append('svg')
        //     .classed('svg', true);
        // svgUpdate.exit().remove();
        // svgUpdate = svgUpdate.merge(svgEnter)
        //     .attr('width', width)
        //     .attr('height', height)
        //     .style('position', 'absolute')
        //     .style('top', 0)
        //     .style('left', 0);
        //
        // const axis = d3.axisLeft()
        //     .scale(perpScale);
        //
        // const axes = svgUpdate.selectAll('.axis')
        //     .data(['i', 'ii', 'iii'])
        //     .enter()
        //     .append('g')
        //     .attr('class', d => 'axis ' + d)
        //     .attr('transform', (d,i) => {
        //         if (i === 2) {
        //             return `rotate(${30 + i*60}, ${0}, ${height}) translate(${-174},${99})`;
        //         } else {
        //             return `rotate(${30 + i*60}, ${0}, ${height}) translate(${0},${0})`;
        //         }
        //     })
        //
        //     .call(axis);
        //
        // axes.selectAll('.tick')
        //     .style('display', 'none');
        // axes.selectAll('path')
        //     .style('stroke', 'white');

    }

    // TO DO: create getter-setter pattern for customization

    // returning of module
    return exports;
}

// exporting factory function as default
export default Ternary;




// const axes = svgUpdate.selectAll('.axis')
//     .data(['i', 'ii', 'iii'])
//     .enter().append('g')
//     .attr('class', d => 'axis ' + d)
//     .attr('transform', d => {
//         return d === 'iii' ? ''
//             : 'rotate(' + (d === 'i' ? 240 : 120) + ',' + (side * 0.5) + ',' + (height / 3 * 2) + ')'
//     })
//     .call(axis)

// axes.selectAll('line')
//     .attr('class', 'dash')
//     .attr('transform', 'translate(' + (side * 0.2) + ',0)')
//     .attr('stroke-dasharray', '9,7')
//     .attr('y1', 0)
//     .attr('y2', 0)
//
// axes.selectAll('text')
//     .attr('transform', 'translate(' + (side * 0.2) + ',-5)')
//
// axes.selectAll('.tick')
//     .append('line')
//     .attr('class', 'grid')
//     .attr('x1', function (d) { return side * (d * 0.5) })
//     .attr('x2', function (d) { return side * (-d * 0.5 + 1) })
//     .attr('y1', 0)
//     .attr('y2', 0)
//
// axes.append('path')
//     .attr('class', 'arrow')
//     .attr('d', 'M0 0 L5 9 L2 9 L2 15 L-2 15 L-2 9 L-5 9 Z')
//     .attr('transform', 'translate(' + (side * 0.5) + ',10)')
//     .on('click', rotate)
//
// axes.append('text')
//     .attr('class', 'label')
//     .attr('x', side * 0.5)
//     .attr('y', -6)
//     .attr('text-anchor', 'middle')
//     .attr('letter-spacing', '-8px')
//     .text(function (d) { return d })
//     .on('click', rotate)
//
// function rotate(d) {
//     var angle = d === 'i' ? 120 : d === 'ii' ? 240 : 0
//     svg.transition().duration(600)
//         .attr('transform', 'rotate(' + angle + ',' + (side / 2) + ',' + (height / 3 * 2) + ')')
// }
//
