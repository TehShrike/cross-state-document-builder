var { createStore, applyMiddleware } = require('redux')
var createDispatchHandler = require('./dispatch-handler.js')

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
