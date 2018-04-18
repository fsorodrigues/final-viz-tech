// importing d3.js
import * as d3 from 'd3';

// importing modules
import {} from '../utils';

// SCROLLMAGIC
const Scrollmagic = require('scrollmagic');

// // setting up modules
// const drawLine = DrawLine();

// importing stylesheets

function Controller(_) {

    // creating dispatcher
    const _dispatch = d3.dispatch('scene:enter', 'scene:leave', 'chart:stick', 'text:color')

    //First, you need to create a Controller
    const _controller = new Scrollmagic.Controller();

    function exports(data) {
        //Then, you create a bunch of scenes
        const scene1 = new Scrollmagic.Scene({
        		triggerElement:'#scene-1',
                offset: 250
        	})
        	.on('enter', () => {
                console.log('scene-1 start');
                const thisEl = d3.select('#scene-1').node();
        		_dispatch.call('scene:enter', thisEl, data);
                _dispatch.call('chart:stick', null, null);
                _dispatch.call('text:color', thisEl, null)
        	}).on('leave', () => {
                console.log('scene-1 end');
                const thisEl = d3.select('#scene-1').node();
                _dispatch.call('scene:leave', thisEl, data);
            })
        	.addTo(_controller);

        const scene2 = new Scrollmagic.Scene({
        		triggerElement:'#scene-2',
                offset: 300
        	})
        	.on('enter', () => {
                console.log('scene-2 start');
                const thisEl = d3.select('#scene-2').node();
        		_dispatch.call('scene:enter', thisEl, data);
                _dispatch.call('text:color', thisEl, null)
        	})
        	.on('leave', () => {
        		console.log('scene-2 end');
                const thisEl = d3.select('#scene-1').node();
                _dispatch.call('scene:leave', thisEl, data);
        	})
        	.addTo(_controller);

        const scene3 = new Scrollmagic.Scene({
        		triggerElement:'#scene-3',
                offset: 300
        	})
        	.on('enter', () => {
                console.log('scene-3 start');
                const thisEl = d3.select('#scene-3').node();
        		_dispatch.call('scene:enter', thisEl, data);
                _dispatch.call('text:color', thisEl, null)
        	})
        	.on('leave', () => {
        		console.log('scene-3 end');
                const thisEl = d3.select('#scene-3').node();
        		_dispatch.call('scene:leave', thisEl, data);
        	})
        	.addTo(_controller);

        const scene4 = new Scrollmagic.Scene({
        		triggerElement:'#scene-4',
                offset: 300
        	})
        	.on('enter', () => {
                console.log('scene-4 start');
                const thisEl = d3.select('#scene-4').node();
        		_dispatch.call('scene:enter', thisEl, data);
                _dispatch.call('text:color', thisEl, null)
        	})
        	.on('leave', () => {
        		console.log('scene-4 end');
                const thisEl = d3.select('#scene-4').node();
        		_dispatch.call('scene:leave', thisEl, data);
        	})
        	.addTo(_controller);

    }

    exports.on = function(eventType, cb) {
        // eventType is a string
        // cb is a function
        _dispatch.on(eventType, cb);
		return this;
    };

    return exports;
}

export default Controller;
