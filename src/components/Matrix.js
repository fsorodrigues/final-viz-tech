// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatNumber} from '../utils';
import Button from './Button';

// importing stylesheets
import '../style/matrix.css';

// setting up modules
const button = Button()
    .buttonClass('btn-rects');

// setting up scales
const scaleX = d3.scaleLinear();
const scaleY = d3.scaleBand();
const margin = {t:20, r:20, b:20, l:50};

const scaleColor = d3.scaleOrdinal()
    .domain(['total_complete_game', 'total_no_hitter', 'total_perfect_game', 'total_triple_plays'])
    .range(['#40B55C', '#ECB55B', '#EB4F5C', '#40ADEE']);

const scaleOpacity = d3.scaleLinear();

const _dispatch = d3.dispatch('rect:enter', 'rect:leave');

// defining Factory function
function Matrix(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'Histogram title', sub:'subtitle'};
    let _footer = {credit:'Credit', source:'data source'};

    let _accessor = 'total_triple_plays'

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
            .selectAll('.matrix')
            .data([1]);
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('matrix', true);
        svgUpdate.exit().remove();
        svgEnter.append('g').classed('plot-matrix', true);
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', width)
            .attr('height', height);

        // Selecting group where svg elements are appendend
        const plot = svgUpdate.merge(svgEnter)
            .select('.plot-matrix')
            .attr('transform',`translate(${margin.l},${margin.t})`);

        // Transform data
        const teamList = d3.nest()
            .key(d => d.team)
            .entries(data)
            .map(d => {
                return d.key
            });

        const _data = data.map(d => {
            return {
                x0: +d.year,
                x1: +d.year + 1,
                ...d
            }
        })
        .filter(d => d.total_triple_plays > 0);

        // Setting up scales
        scaleX.domain([d3.min(data,d => d.year),d3.max(data,d => d.year)]).range([0,w]);
		scaleY.domain(teamList).rangeRound([0,h])
            .paddingInner(0.05)
            .align(0.1);
        const minFig = d3.min(data,d => d[_accessor]);
        const maxFig = d3.max(data,d => d[_accessor]);
        scaleOpacity.domain([minFig,maxFig]).range([0.1,0.9]);

        //Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-(w + margin.r))
			// .ticks(5);

		const axisX = d3.axisBottom()
			.scale(scaleX)
            .tickFormat(d => formatNumber(d))
			// .ticks(_tickX)
			// .tickFormat(_tickXFormat);

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
            // .attr('transform',`translate(-${margin.r},0)`)
            .attr('transform',`translate(-7,0)`)
			.call(axisY);

        // Update
        const binsUpdate = plot.selectAll('.bin')
            .data(_data);

        //Exit
        binsUpdate.exit()
            .transition()
            .duration(800)
            .attr('x', d => scaleX(d.x0))
            .attr('y', d => -100)
            .remove();

		//Enter
		const binsEnter = binsUpdate.enter()
			.append('rect')
			.attr('class','bin')
            .attr('value', _accessor)
			.attr('x', d => scaleX(d.x0))
			.attr('y', d => h)
            .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
			.attr('height', (h/teamList.length) -1)
            .style('fill-opacity', d => scaleOpacity(d[_accessor]))
			.style('fill', scaleColor(_accessor))
            .on('mouseenter', function(d) {_dispatch.call('rect:enter', this, d, d3.select(this).attr('value'));})
            .on('mouseleave', function(d) {_dispatch.call('rect:leave', this, d, _accessor);});

		//Enter + Update
		binsEnter.merge(binsUpdate)
			.attr('x', d => (scaleX(d.x0) - ((scaleX(d.x1) - scaleX(d.x0))-1)/2))
			.attr('y', d => scaleY(d.team))
            .attr('value', _accessor)
            .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
            .attr('height', (h/teamList.length) -1)
            .transition()
			.duration(500)
            .style('fill-opacity', d => scaleOpacity(d.total_triple_plays))
			.style('fill', scaleColor('total_triple_plays'));

        //Exit
		binsUpdate.exit()
            .transition()
            .duration(500)
            .attr('x', d => scaleX(d.x0))
            .attr('y', d => 0)
            .remove();

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

        const btnContainer = headerUpdate.append('div')
            .classed('btn-container', true);

        btnContainer.datum(data)
            .each(button);

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

    exports.on = function(eventType, cb) {
        // eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
    }

    // returning of module
    return exports;
}

// exporting factory function as default
export default Matrix;

// setting up accessory factory function
const drawRects = DrawRects();

// receiving event dispatch and calling drawing function
button.on('btn:clicked', function(data, value) {
    drawRects.accessor(value);
    drawRects(data);
    d3.selectAll('.btn-rects').classed('active-button', false);
    d3.select(this).classed('active-button', true);
});


// defining accessory factory functions
// not exporting
function DrawRects(_) {

    // create getter-setter variables in factory scope
    let _accessor;

    function exports(data) {

    const root = d3.select('.plot-matrix');
    const svg = d3.select('.matrix');

    // declaring setup/layout variables
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const w = width - (margin.r + margin.l);
    const h = height - (margin.t + margin.b);

    // Transform data
    const teamList = d3.nest()
        .key(d => d.team)
        .entries(data)
        .map(d => {
            return d.key
        });

    const _data = data.map(d => {
        return {
            x0: +d.year,
            x1: +d.year + 1,
            ...d
        }
    }).filter(d => d[_accessor] > 0);

    // Setting up scales
    scaleX.domain([d3.min(data,d => d.year),d3.max(data,d => d.year)]).range([0,w]);
	scaleY.domain(teamList).rangeRound([0,h])
        .paddingInner(0.05)
        .align(0.1);
    const minFig = d3.min(data,d => d[_accessor]);
    const maxFig = d3.max(data,d => d[_accessor]);
    scaleOpacity.domain([minFig,maxFig]).range([0.1,0.9]);

    //Set up axis generator
    const axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-(w + margin.r))
        // .ticks(5);

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

    // Update
    root.selectAll('.bin').remove();

    const binsUpdate = root.selectAll('.bin')
        .data(_data);

    //Enter
    const binsEnter = binsUpdate.enter()
        .append('rect')
        .classed('bin', true)
        .attr('value', _accessor)
        .attr('x', d => scaleX(d.x0))
        .attr('y', d => h)
        .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
        .attr('height', (h/teamList.length) -1)
        .style('fill-opacity', d => scaleOpacity(d[_accessor]))
        .style('fill', scaleColor(_accessor))
        .on('mouseenter', function(d) {_dispatch.call('rect:enter', this, d, d3.select(this).attr('value'));})
        .on('mouseleave', function(d) {_dispatch.call('rect:leave', this, d, _accessor);});

    //Enter + Update
    binsEnter.merge(binsUpdate)
        .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
        .attr('height', (h/teamList.length) -1)
        .attr('value', _accessor)
        .transition()
        .duration(3000)
        .attr('x', d => (scaleX(d.x0) - ((scaleX(d.x1) - scaleX(d.x0))-1)/2))
        .attr('y', d => scaleY(d.team))
        .style('fill-opacity', d => scaleOpacity(d[_accessor]))
        .style('fill', scaleColor(_accessor));

    // //Exit
    // binsUpdate.exit()
    //     .transition()
    //     .duration(800)
    //     .attr('x', d => scaleX(d.x0))
    //     .attr('y', () => -100)
    //     .remove();

    }

    // create getter-setter pattern for customization
    exports.accessor = function(_) {
		if (typeof _ === "undefined") return _accessor
		_accessor = _;
		return this
	}

    return exports
}
