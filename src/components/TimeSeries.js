// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatNumber} from '../utils';
import Button from './Button';

// importing stylesheets
import '../style/timeseries.css';

// setting up modules
const button = Button()
    .buttonClass('btn-bars');

const scaleX = d3.scaleLinear();
const scaleY = d3.scaleLinear()
const margin = {t:20, r:20, b:20, l:50};

// defining Factory function
function TimeSeries(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'Histogram title', sub:'subtitle'};
    let _footer = {credit:'Credit', source:'data source'};

    const _dispatch = d3.dispatch('bar:enter', 'bar:leave');

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
            .selectAll('.timeseries')
            .data([1]);
        const svgEnter = svgUpdate.enter()
            .append('svg')
            .classed('timeseries', true);
        svgUpdate.exit().remove();
        svgEnter.append('g').attr('class','plot-bar')
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', width)
            .attr('height', height);

        // Selecting group where svg elements are appendend
        const plot = svgUpdate.merge(svgEnter)
            .select('.plot-bar')
            .attr('transform',`translate(${margin.l},${margin.t})`);

        //Transform data
        let dataByYear = d3.nest()
			.key(d => d.year)
            .entries(data)
            .map(d => {
                return {
                    x0: +d.key,
                    x1: +d.key + 1,
                    total_games: +d.values.length,
                    value: d3.sum(d.values, e => e.game_triple_plays),
                    games: d.values.filter(f => f.game_triple_plays != 0).map(d => {
                        return {
                            team: "a",
                            triple_plays: "b"
                        };
                    })
                };
            });

        // Setting up scales
        scaleX.domain([d3.min(data,d => d.year),d3.max(data,d => d.year)]).range([0,w]);
		const maxVolume = d3.max(dataByYear, d => d.value);
		scaleY.domain([0, maxVolume]).range([h,0]).nice();

        //Update
        const binsUpdate = plot.selectAll('.bin')
			.data(dataByYear);

		//Enter
		const binsEnter = binsUpdate.enter()
			.append('rect')
			.attr('class','bin') //If you forget this, what will happen if we re-run this the activityHistogram function?
			.attr('x', d => scaleX(d.x0))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
			.attr('y', d => h)
			.attr('height', 0)
            .on('mouseenter', function(d) {_dispatch.call('bar:enter', this, d);})
            .on('mouseleave', function(d) {_dispatch.call('bar:leave', this, d);});

		//Enter + Update
		binsEnter.merge(binsUpdate)
			.transition()
			.duration(500)
			.attr('x', d => (scaleX(d.x0) - ((scaleX(d.x1) - scaleX(d.x0))-1)/2))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
			.attr('y', d => scaleY(d.value))
			.attr('height', d => (h - scaleY(d.value)))
			.style('fill','#40ADEE')
            .style('fill-opacity', 0.6);

        //Exit
		binsUpdate.exit().remove();

        //Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-(w+margin.l))
			.ticks(5);

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

        const btnContainer = headerUpdate.append('div')
            .classed('btn-container', true);

        btnContainer.datum(data)
            .each(button);

        btnContainer.select('#triple_plays').classed('active-button', true);

    }

    // create getter-setter pattern for customization
    exports.header = function(_) {
		// _ is an object { title: , sub: }
		if (typeof _ === "undefined") return _header
		_header = _;
		return this
	}
    exports.footer = function(_) {
		// _ is an object { credit: , source: }
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
export default TimeSeries;

// setting up accessory factory function
const drawBars = DrawBars();

// receiving event dispatch and calling drawing function
button.on('btn:clicked', function(data, value) {
    drawBars.accessor(value);
    drawBars(data);
    d3.selectAll('.btn-bars').classed('active-button', false);
    d3.select(this).classed('active-button', true);
});

// defining accessory factory functions
// not exporting
function DrawBars(_) {

    // create getter-setter variables in factory scope
    let _accessor;

    function exports(data) {
    // console.log(_accessor);

    _accessor = _accessor.replace('total', 'game');

    //Transform data
    let dataByYear = d3.nest()
        .key(d => d.year)
        .entries(data)
        // .map(d => d.values);
        .map(d => {
            return {
                x0: +d.key,
                x1: +d.key + 1,
                total_games: +d.values.length,
                value: d3.sum(d.values, e => e[_accessor])
            }
        });

    const root = d3.select('.plot-bar');
    const svg = d3.select('.timeseries');

    // declaring setup/layout variables
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const w = width - (margin.r + margin.l);
    const h = height - (margin.t + margin.b);

    // Setting up scales
    const maxVolume = d3.max(dataByYear, d => d.value);
    scaleY.domain([0,maxVolume]).range([h,0]).nice();
    const scaleColor = d3.scaleOrdinal()
        .domain(['game_complete_game', 'game_no_hitter', 'game_perfect_game', 'game_triple_plays'])
        .range(['#40B55C', '#ECB55B', '#EB4F5C', '#40ADEE']);
        // #EEA7E9 5th color

    //Update
    const binsUpdate = root.selectAll('.bin')
        .data(dataByYear);

    //Enter
    const binsEnter = binsUpdate.enter()
        .append('rect')
        .attr('class','bin') //If you forget this, what will happen if we re-run this the activityHistogram function?
        .attr('x', d => scaleX(d.x0))
        .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
        .attr('y', d => h)
        .attr('height', 0)
        .on('mouseenter', function(d) {_dispatch.call('bar:enter', this, d);})
        .on('mouseleave', function(d) {_dispatch.call('bar:leave', this, d);});

    //Enter + Update
    binsEnter.merge(binsUpdate)
        .transition()
        .duration(500)
        .attr('x', d => (scaleX(d.x0) - ((scaleX(d.x1) - scaleX(d.x0))-1)/2))
        .attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
        .attr('y', d => scaleY(d.value))
        .attr('height', d => (h - scaleY(d.value)))
        .style('fill', scaleColor(_accessor))
        .style('fill-opacity', 0.6);

    //Exit
    binsUpdate.exit().remove();

    //Set up axis generator
    const axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-(w+margin.l))
        .ticks(5);

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
    exports.accessor = function(_) {
		if (typeof _ === "undefined") return _accessor
		_accessor = _;
		return this
	}

    return exports
}
