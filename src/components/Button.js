// importing d3.js
import * as d3 from 'd3';

// importing accessory functions

// importing stylesheets
import '../style/button.css';

// defining Factory function
function Button(_) {

    // create getter-setter variables in factory scope
    let _buttonClass = '';
    // // declaring dispatch
    const _dispatch = d3.dispatch('btn:clicked');

    function exports(data) {
        // selecting root element ==> svg container, div where function is called in index.js
        const root = this;

        // declaring setup/layout variables

        // setting up scales

        const dataByYear = d3.nest()
            .key(d => d.year)
            .entries(data)
            .map(d => {
                return {
                    year: +d.key,
                    total_games: +d.values.length,
                    total_triple_plays: d3.sum(d.values, e => e.game_triple_plays),
                    total_no_hitter: d3.sum(d.values, e => e.game_no_hitter),
                    total_perfect_game: d3.sum(d.values, e => e.game_perfect_game),
                    total_complete_game: d3.sum(d.values, e => e.game_complete_game)
                }
            });

        // getting list of keys for button
        const buttonData = Object.keys(dataByYear[0]).slice(2);

        // appending buttons
        let btn = d3.select(root)
            .selectAll('.btn '+_buttonClass)
            .data(buttonData);

        const btnEnter = btn.enter()
            .append('button')
            .classed('btn', true)
            .classed(_buttonClass, true)
            .attr('id', d => d.replace('total_',''))
            .text(d => d.replace('total_','').replace('_',' ').toUpperCase())
            .attr('value', d => d)
            .on('click', function(){
                let value = d3.select(this).attr('value');
                console.log(value);
                _dispatch.call('btn:clicked', this, data, value);
			});

        btn = btn.merge(btnEnter);

    }

    // create getter-setter pattern for customization
    exports.on = function(eventType, cb) {
		// eventType is a string
		// cb is a function
		_dispatch.on(eventType, cb);
		return this;
	}

    exports.buttonClass = function(_) {
		// _ is a str
        if (typeof _ === "undefined") return _buttonClass
		_buttonClass = _;
		return this;
	}

    // returning of module
    return exports;
}

// exporting factory function as default
export default Button;
