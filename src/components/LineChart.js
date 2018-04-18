// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatNumber, formatPercent} from '../utils';
import Button from './Button';
import Controller from './ScrollAnimation';

// importing stylesheets
import '../style/timeseries.css';

// setting up modules
const controller = Controller();

// defining global variables
const scaleX = d3.scaleLinear();
const scaleY = d3.scaleLinear();
const margin = {t:20, r:20, b:20, l:65};

// defining Factory function
function LineChart(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'Histogram title', sub:'subtitle'};
    let _footer = {credit:'Credit', source:'data source'};
    // let _drawAxis = DrawAxis(); // factory function

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const w = width - (margin.r + margin.l);
        const h = height - (margin.t + margin.b);

        // appending header (title and sub) to node
        let headerUpdate = d3.select(root)
            .selectAll('.chart-header')
            .data([_header]);
        const headerEnter = headerUpdate.enter()
            .append('div')
            .classed('chart-header', true);
        headerUpdate.exit().remove();
        headerUpdate = headerUpdate.merge(headerEnter);
        headerUpdate.append('h2')
            .html(d => d.title)
            .classed('chart-title', true);
        headerUpdate.append('h5')
            .html(d => d.sub)
            .classed('chart-subtitle', true);

        // appending svg to node
        // enter, exit, update pattern
        let svgUpdate = d3.select(root)
            .selectAll('.line-chart')
            .data([1]);
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('line-chart', true);
        svgUpdate.exit().remove();
        svgEnter.append('g').classed('plot-line', true);
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', width)
            .attr('height', height);

        // Setting up scales
        scaleX.domain([d3.min(data,d => d.year),d3.max(data,d => d.year)]).range([0,w]);
        scaleY.domain([0,1]).range([h,0]).nice();

        // Selecting group where svg elements are appendend
        const plot = svgUpdate.merge(svgEnter)
            .select('.plot-line')
            .attr('transform',`translate(${margin.l},${margin.t})`);

        //Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-(w+margin.l))
			.ticks(5)
            .tickFormat(d => formatPercent(d));

		const axisX = d3.axisBottom()
			.scale(scaleX)
            .tickFormat(d => formatNumber(d))
			// .ticks(_tickX)
			// .tickFormat(_tickXFormat);

        // draw axis
        //Axis
		const axisXNode = plot
			.selectAll('.axis-x')
			.data([1]);

		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis axis-x');

		axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${h})`)
			.call(axisX);

		const axisYNode = plot
			.selectAll('.axis-y')
			.data([1]);

		const axisYNodeEnter = axisYNode.enter()
			.append('g')
			.attr('class','axis axis-y');

		axisYNode.merge(axisYNodeEnter)
            .attr('transform',`translate(-${margin.r},0)`)
			.call(axisY);

        // appending footer (credit and source) to node
        let footerUpdate = d3.select(root)
            .selectAll('.chart-footer')
            .data([_footer]);
        const footerEnter = footerUpdate.enter()
            .append('div')
            .classed('chart-footer', true);
        footerUpdate.exit().remove();
        footerUpdate = footerUpdate.merge(footerEnter);
        footerUpdate.append('h6')
            .html(d => `Credit: ${d.credit}`)
            .classed('chart-credit', true);
        footerUpdate.append('h6')
            .html(d => `Data: ${d.source}`)
            .classed('chart-source', true);

    }

    // create getter-setter pattern for customization
    exports.header = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _header
		_header = _;
		return this
	}
    exports.footer = function(_) {
		// _ is an object { title: }
		if (typeof _ === "undefined") return _footer
		_footer = _;
		return this
	}

    // returning of module
    return exports;
}

// exporting factory function as default
export default LineChart;

// defining accessory factory functions
export function DrawLine(_) {

    // create getter-setter variables in factory scope
    let _lineGen;

    function exports(data) {

    //Transform data
    const dataByYear = d3.nest()
		.key(d => d.year)
        .entries(data)
        // .map(d => d.values);
        .map(d => {
            return {
                year: d.key,
                total_games: +d.values.length,
                total_triple_plays: d3.sum(d.values, e => e.game_triple_plays),
                total_complete_game: d3.sum(d.values, e => e.game_complete_game),
                total_no_hitter: d3.sum(d.values, e => e.game_no_hitter),
                total_perfect_game: d3.sum(d.values, e => e.game_perfect_game)
            }
        });

    const root = d3.select('.plot-line');
    const svg = d3.select('.line-chart');

    // declaring setup/layout variables
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const w = width - (margin.r + margin.l);
    const h = height - (margin.t + margin.b);

    // Setting up scales
    scaleX.domain([d3.min(data,d => d.year),d3.max(data,d => d.year)])
    const maxVolume = d3.max(dataByYear, d => d[_lineGen]/d.total_games);
    scaleY.domain([0,maxVolume]).nice();
    const scaleColor = d3.scaleOrdinal()
        .domain(['total_complete_game', 'total_no_hitter', 'total_perfect_game', 'total_triple_plays'])
        .range(['#40B55C', '#ECB55B', '#EB4F5C', '#40ADEE']);
        // .range([d3.rgb('#8AC535'), d3.rgb('#D8EBC1')]);


    // creating line generator
    const line = d3.line()
        .x(d => scaleX(d.year))
        .y(d => scaleY(d[_lineGen]/d.total_games))
        .curve(d3.curveStep);

    const flat = d3.line()
        .x((d,i) => scaleX(i))
        .y(scaleY(-1));

    // Update
    let linesUpdate = root.selectAll('.line-year')
        .data([dataByYear]);

    // Enter
    const linesEnter = linesUpdate.enter()
        .append('path')
        .attr('class','line-year')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('d', line);

    // Exit
    linesUpdate.exit().remove();

    // Enter + Update
    linesUpdate = linesEnter.merge(linesUpdate)
        .transition()
        .duration(500)
        .attr('d', line)
        .attr('opacity', 1)
        .attr('stroke', scaleColor(_lineGen));

    //Set up axis generator
    const axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-(w+margin.l))
        .ticks(5)
        .tickFormat(d => formatPercent(d));

    const axisX = d3.axisBottom()
        .scale(scaleX)
        .tickFormat(d => formatNumber(d))

    //Axis
    const axisXNode = root.selectAll('.axis-x')
        .data([1]);

    const axisXNodeEnter = axisXNode.enter()
        .append('g')
        .attr('class','axis axis-x');

    axisXNode.merge(axisXNodeEnter)
        // .attr('transform',`translate(0,${h})`)
        .transition()
        .call(axisX);

    const axisYNode = root.selectAll('.axis-y')
        .data([1]);

    const axisYNodeEnter = axisYNode.enter()
        .append('g')
        .attr('class','axis axis-y');

    axisYNode.merge(axisYNodeEnter)
        // .attr('transform',`translate(-${margin.r},0)`)
        .transition()
        .call(axisY);

    }

    // create getter-setter pattern for customization
    exports.lineGen = function(_) {
		if (typeof _ === "undefined") return _lineGen
		_lineGen = _;
		return this
	}

    return exports
}
