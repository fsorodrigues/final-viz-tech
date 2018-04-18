// importing d3.js
import * as d3 from 'd3';

// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// importing stylesheets
import './style/main.css';
import './style/text.css';

// importing parsing functions from utils
import {parseHist, parseMatrix, fetchCsv} from './utils';

// importing modules
import LineChart from './components/LineChart';
import {DrawLine} from './components/LineChart';
import TimeSeries from './components/TimeSeries';
import Matrix from './components/Matrix';
import Controller from './components/ScrollAnimation';

const scaleColor = d3.scaleOrdinal()
    .domain(['total_complete_game', 'total_no_hitter', 'total_perfect_game', 'total_triple_plays'])
    .range(['#40B55C', '#ECB55B', '#EB4F5C', '#40ADEE']);

// calling factories and setting'em up
const linechart = LineChart()
    .header({title:'Some funny title',
        sub:'<span class="text-sub" id="triple_plays">Triple-plays</span>,\
            <span class="text-sub" id="complete_game">Complete Games</span>,\
            <span class="text-sub" id="no_hitter">No-hitters</span>,\
            and <span class="text-sub" id="perfect_game">Perfect Games</span> per game, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const timeSeries = TimeSeries()
    .header({title:'Some other funny title', sub:'Total triple-plays per season, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const matrix = Matrix()
    .header({title:'Some other funny title', sub:'Matrix team x season, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const drawLine = DrawLine();

const controller = Controller()
    .on('scene:enter', function(d) {
        const value = d3.select(this).attr('value');
        drawLine.lineGen(value);
        drawLine(d);
    })
    .on('scene:leave', function(d) {
        const value = d3.select(this).attr('value');
        drawLine.lineGen(value);
        drawLine(d);
    })
    .on('chart:stick', function() {
        const chart = d3.select('.line-container');
        chart.style('position', 'sticky')
            .style('top', '5%');
    })
    .on('text:color', function() {
        const value = d3.select(this).attr('value');
        const textEl = value.replace('total_', '');
        d3.select('#'+textEl)
            .style('color', () => scaleColor(value));
    });

// TO DO: importing data using the Promise interface
Promise.all([
    fetchCsv('./data/gamelog_1970_2017.csv', parseHist),
    fetchCsv('./data/matrix_year_team.csv', parseMatrix),
]).then(([game_logs, data_matrix]) => {

    d3.select('.line-container')
        .datum(game_logs)
        .each(linechart);

    d3.select('.bar-container')
        .datum(game_logs)
        .each(timeSeries);

    d3.select('.matrix-container')
        .datum(data_matrix)
        .each(matrix);

    controller(game_logs);

});

timeSeries.on('bar:enter', function(d) {
    d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-width', 1)
        .style('stroke', 'black');
}).on('bar:leave', function(d) {
    d3.select(this)
        .style('fill-opacity', 0.6)
        .style('stroke-width', 0)
        .style('stroke', 'none');
});

matrix.on('rect:enter', function(d) {
    d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-width', 1)
        .style('stroke', 'black');
}).on('rect:leave', function(d) {
    d3.select(this)
        .style('fill-opacity', 0.6)
        .style('stroke-width', 0)
        .style('stroke', 'none');
});







const _svg = document.querySelector('.hero-svg');

const width = _svg.clientWidth;
const height = _svg.clientHeight;
const size = 15;

const svg = d3.select('.hero-svg')

svg.append('rect')
    .attr('x', -1)
    .attr('y', -1)
    .attr('height', size)
    .attr('width', size)
    .attr('fill', 'white')

svg.append('rect')
    .attr('x', width - size)
    .attr('y', -1)
    .attr('height', size)
    .attr('width', size)
    .attr('fill', 'white')

svg.append('rect')
    .attr('x', width - size)
    .attr('y', height - size)
    .attr('height', size)
    .attr('width', size)
    .attr('fill', 'white')

svg.append('rect')
    .attr('x', -1)
    .attr('y', height - size)
    .attr('height', size + 10)
    .attr('width', size)
    .attr('fill', 'white')
