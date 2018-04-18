// importing d3.js
import * as d3 from 'd3';

// importing modules
import {formatNumber} from '../utils';
import Button from './Button';

// importing stylesheets
import '../style/timeseries.css';

// setting up modules
const button = Button();

// defining Factory function
function Matrix(_) {

    // create getter-setter variables in factory scope
    let _header = {title:'Histogram title', sub:'subtitle'};
    let _footer = {credit:'Credit', source:'data source'};

    const _dispatch = d3.dispatch('rect:enter', 'rect:leave');

    function exports(data) {
        // selecting root element ==> chart container, div where function is called in index.js
        const root = this;

        // declaring setup/layout variables
        const width = root.clientWidth;
        const height = root.clientHeight;
        const margin = {t:20, r:20, b:20, l:35};
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
        svgEnter.append('g').attr('class','plot')
        svgUpdate = svgUpdate.merge(svgEnter)
            .attr('width', width)
            .attr('height', height);

        // Selecting group where svg elements are appendend
        const plot = svgUpdate.merge(svgEnter)
            .select('.plot')
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
        });

        // Setting up scales
        const scaleX = d3.scaleLinear().domain([d3.min(data,d => d.year),d3.max(data,d => d.year)]).range([0,w]);
		const scaleY = d3.scaleBand().domain(teamList).rangeRound([0,h])
            .paddingInner(0.05)
            .align(0.1);
        const scaleColor = d3.scaleLinear()
            .domain([d3.min(data,d => d.year),d3.max(data,d => d.year)])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb('#c40d0d'), d3.rgb('#eee8aa')]);

        // Update
        const binsUpdate = plot.selectAll('.bin')
			.data(_data);

		//Enter
		const binsEnter = binsUpdate.enter()
			.append('rect')
			.attr('class','bin') //If you forget this, what will happen if we re-run this the activityHistogram function?
			.attr('x', d => scaleX(d.x0))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
			.attr('y', d => h)
			.attr('height', (h/teamList.length) -1)
            .on('mouseenter', function(d) {_dispatch.call('rect:enter', this, d);})
            .on('mouseleave', function(d) {_dispatch.call('rect:leave', this, d);});

		//Enter + Update
		binsEnter.merge(binsUpdate)
			.transition()
			.duration(500)
			.attr('x', d => (scaleX(d.x0) - ((scaleX(d.x1) - scaleX(d.x0))-1)/2))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0))-1)
			.attr('y', d => scaleY(d.team))
            .style('fill-opacity', 0.6)
			.style('fill', d => `rgba(216,235,193,${5*(d.total_complete_game/162)})`);

        //Exit
		binsUpdate.exit().remove();

        //Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(0)
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

// defining accessory factory functions
// not exporting
function DrawRects(_) {

    // create getter-setter variables in factory scope

    function exports() {

    }
}
