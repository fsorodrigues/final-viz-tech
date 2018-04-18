// importing d3.js
import * as d3 from 'd3';

// importing modules
import Ternary from './Ternaryplot';

// importing stylesheets

// setting up modules
const ternaryplot = Ternary();

// defining Factory function
function Multiples(_) {

    // TO DO: create getter-setter variables in factory scope

    function exports(data) {
        // selecting root element ==> table container, div where function is called in index.js
        const root = this;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const margin = {t:20, r:20, b:20, l:20};

        // data transformation
        const dataByYear = d3.nest()
            .key(d => d.year)
            .entries(data)
            .map(d => d.values);

        // appending nodes
        let yearNodeUpdate = d3.select(root)
            .selectAll('.year-node')
            .data(dataByYear, d => d.key);
        const yearNodeEnter = yearNodeUpdate.enter()
            .append('div')
            .classed('year-node', true)
            .style('width', '200px')
            .style('height', '200px')
            .style('float', 'left')
            .style('position', 'relative')
            .style('margin-left', '1rem')
            .style('margin-bottom', '1rem');
        yearNodeUpdate.exit().remove();

        yearNodeUpdate.merge(yearNodeEnter)
            .append('p')
            .html(d => {
                return d3.nest()
                    .key(e => e.year)
                    .entries(d)
                    .map(e => e.key);
                });

        yearNodeUpdate.merge(yearNodeEnter)
            .each(ternaryplot);

    }

    // TO DO: create getter-setter pattern for customization

    // returning of module
    return exports;
}

// exporting factory function as default
export default Multiples;





//
// var axis = d3.axisLeft()
//     .scale(perpScale)
//     .tickFormat(function (n) { return (n * 100).toFixed(0) })
//     .tickSize(side * -0.3)
//     .tickPadding(5)
//
// var axes = svg.selectAll('.axis')
//     .data(['i', 'ii', 'iii'])
//     .enter().append('g')
//     .attr('class', function (d) { return 'axis ' + d })
//     .attr('transform', function (d) {
//         return d === 'iii' ? ''
//             : 'rotate(' + (d === 'i' ? 240 : 120) + ',' + (side * 0.5) + ',' + (height / 3 * 2) + ')'
//     })
//     .call(axis)
//
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
