/**
 * The component for playing slides automatically.
 *
 * @author    Naotoshi Fujita
 * @copyright Naotoshi Fujita. All rights reserved.
 */

import { applyStyle, subscribe } from '../../utils/dom';
import { createInterval } from '../../utils/time';

/**
 * Set of pause flags.
 */
const PAUSE_FLAGS = {
	HOVER : 1,
	FOCUS : 2,
	MANUAL: 3,
};


/**
 * The component for playing slides automatically.
 *
 * @param {Splide} Splide     - A Splide instance.
 * @param {Object} Components - An object containing components.
 * @param {string} name       - A component name as a lowercase string.
 *
 * @return {Object} - The component object.
 */
export default ( Splide, Components, name ) => {
	/**
	 * Store pause flags.
	 *
	 * @type {Array}
	 */
	let flags = [];

	/**
	 * Store an interval object.
	 *
	 * @type {Object};
	 */
	let interval;

	/**
	 * Autoplay component object.
	 *
	 * @type {Object}
	 */
	const Autoplay = {
		/**
		 * Required only when the autoplay option is true.
		 *
		 * @type {boolean}
		 */
		required: Splide.options.autoplay,

		/**
		 * Called when the component is mounted.
		 * Note that autoplay starts only if there are slides over perPage number.
		 */
		mount() {
			const options = Splide.options;
			const { slides, bar } = Components.Elements;

			if ( slides.length > options.perPage ) {
				interval = createInterval( () => { Splide.go( '>' ) }, options.interval, rate => {
					Splide.emit( `${ name }:playing`, rate );
					bar && applyStyle( bar, { width: `${ rate * 100 }%` } );
				} );

				bind();
				this.play();
			}
		},

		/**
		 * Start autoplay.
		 *
		 * @param {number} flag - A pause flag to be removed.
		 */
		play( flag = 0 ) {
			flags = flags.filter( f => f !== flag );

			if ( ! flags.length ) {
				Splide.emit( `${ name }:play` );
				interval.play();
			}
		},

		/**
		 * Pause autoplay.
		 * Note that Array.includes is not supported by IE.
		 *
		 * @param {number} flag - A pause flag to be added.
		 */
		pause( flag = 0 ) {
			interval.pause();

			if ( flags.indexOf( flag ) === -1 ) {
				flags.push( flag );
			}

			if ( flags.length === 1 ) {
				Splide.emit( `${ name }:pause` );
			}
		},
	};

	/**
	 * Listen some events.
	 */
	function bind() {
		const options  = Splide.options;
		const Elements = Components.Elements;
		const sub      = Splide.sub;
		const elms     = [ Splide.root, sub ? sub.root : null ];

		if ( options.pauseOnHover ) {
			switchOn( elms, 'mouseleave', PAUSE_FLAGS.HOVER, true );
			switchOn( elms, 'mouseenter', PAUSE_FLAGS.HOVER, false );
		}

		if ( options.pauseOnFocus ) {
			switchOn( elms, 'focusout', PAUSE_FLAGS.FOCUS, true );
			switchOn( elms, 'focusin', PAUSE_FLAGS.FOCUS, false );
		}

		subscribe( Elements.play, 'click', () => {
			// Need to be removed a focus flag at first.
			Autoplay.play( PAUSE_FLAGS.FOCUS );
			Autoplay.play( PAUSE_FLAGS.MANUAL );
		} );

		switchOn( [ Elements.pause ], 'click', PAUSE_FLAGS.MANUAL, false );

		// Rewind the timer when others move the slide.
		Splide.on( 'move', () => { Autoplay.play() } );
	}

	/**
	 * Play or pause on the given event.
	 *
	 * @param {Element[]} elms  - Elements.
	 * @param {string}    event - An event name or names.
	 * @param {number}    flag  - A pause flag defined on the top.
	 * @param {boolean}   play  - Determine whether to play or pause.
	 */
	function switchOn( elms, event, flag, play ) {
		for ( let i in elms ) {
			subscribe( elms[ i ], event, () => { Autoplay[ play ? 'play' : 'pause' ]( flag ) } );
		}
	}

	return Autoplay;
}