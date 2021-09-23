import { Div, Button } from '@rebelstack-io/metaflux';

const CardScroller = (props) => {
	const { data } = props;
	const content = Div({ className: 'scroller-wrapper' }, [
		Button({ className: 'handler-left' }),
		Div({ className: 'scroller-body' }, data),
		Button({ className: 'handler-right' }),
	]);
	_setListeners(content);
	return content;
}

function _setListeners(content) {
	const _right = content.querySelector('.handler-right');
	const _left = content.querySelector('.handler-left');
	const _body = content.querySelector('.scroller-body');
	_right.onclick = () => {
		_bodyScroll( _body, true, _right )
	}
	_left.onclick = () => {
		_bodyScroll( _body, false, _left )
	}
	_calculateActive( _body, _left, _right )
}

function _bodyScroll( _body, isRight, _el ) {
	if (_body.offsetWidth !== _body.scrollWidth) {
			const condition = isRight ? (_body.scrollLeft < _body.scrollWidth) : (_body.scrollLeft > 0)
			if ( condition ) {
				_body.scrollLeft += isRight ? 256 : -256
			}
		}
}

function _calculateActive(_body, _left, _right) {
	const calculate = () => {
		if (_body.scrollWidth === _body.offsetWidth) {
			_right.classList.add('hidden');
			_left.classList.add('hidden');
		}
		if (_body.offsetWidth + _body.scrollLeft < _body.scrollWidth) {
			_right.classList.remove('disabled');
			_body.classList.add('right-more');
		} else {
			_right.classList.add('disabled');
			_body.classList.remove('right-more');
		}
		if (_body.scrollLeft > 0) {
			_left.classList.remove('disabled');
			_body.classList.add('left-more');
		} else {
			_left.classList.add('disabled');
			_body.classList.remove('left-more');
		}
	}
	const interval = setInterval(() => {
		if (_body.baseNode() instanceof HTMLHtmlElement) {
			calculate();
			clearInterval(interval)
		}
	}, 100);
	_body.onscroll = () => {
		calculate()
	}
}


export { CardScroller }
