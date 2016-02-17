var value = require('dom-value')

module.exports = function watchForDispatches(magicalDomThingy, store) {
	function dispatchListener(actionType, payload) {
		var action = {}
		if (payload && typeof payload === 'object') {
			action = payload
		}
		action.type = actionType

		store.dispatch(action)
	}

	function dispatchInputListener(actionType, node) {
		store.dispatch({ type: actionType, payload: value(node) })
	}

	const removeAttachListener = magicalDomThingy.addDomApiAttachListener(ractive => {
		ractive.on('dispatch', dispatchListener)
		ractive.on('dispatchInput', dispatchInputListener)
	})

	const removeDetachListener = magicalDomThingy.addDomApiDetachListener(ractive => {
		ractive.off('dispatch', dispatchListener)
		ractive.off('dispatchInput', dispatchInputListener)
	})

	return {
		stop: () => {
			removeAttachListener()
			removeDetachListener()
		}
	}
}
