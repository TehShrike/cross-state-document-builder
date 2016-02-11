import { createStore, applyMiddleware } from 'redux'
const createDispatchHandler = require('./dispatch-handler')

module.exports = function createDocumentManager(domAwareness, globalMiddlewares = []) {
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
