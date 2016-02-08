import { createStore, applyMiddleware } from 'redux'
const dispatchHandler = require('./dispatch-handler')
const magicalDomThingy = require('./magical-dom-thingy')

module.exports = function createDocumentManager(stateRouter, globalMiddlewares) {
	const stores = {}
	const dispatchWatchers = {}
	const domAwareness = magicalDomThingy(stateRouter)

	function createDocument(id, reducer, initialState) {
		const store = createStore(reducer, initialState)

		dispatchWatchers[id] = dispatchHandler(domAwareness, store, applyMiddleware(...globalMiddlewares))

		stores[id] = store
	}

	function finishDocument(id) {
		if (!dispatchWatchers[id]) {
			throw new Error('the id ' + id + ' doesn\'t exist apparently ')
		}

		dispatchWatchers[id].stop()
		const state = stores[id].getState()

		delete dispatchWatchers[id]
		delete stores[id]

		return state
	}

	return {
		createDocument: createDocument,
		finishDocument: finishDocument
	}
}
