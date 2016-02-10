import { createStore, applyMiddleware } from 'redux'
const createDispatchHandler = require('./dispatch-handler')
const stateRouterDomApiWatcher = require('./state-dom-api-handler')

module.exports = function createDocumentManager(stateRouter, globalMiddlewares = []) {
	const domAwareness = stateRouterDomApiWatcher(stateRouter)

	return function createDocument(reducer, initialState, documentMiddlewares = []) {
		const store = createStore(reducer, initialState)
		const dispatchWatcher = createDispatchHandler(domAwareness, store, applyMiddleware(...documentMiddlewares, ...globalMiddlewares))

		return {
			store: store,
			finishDocument: function finishDocument(id) {
				dispatchWatcher.stop()
			}
		}

	}
}
