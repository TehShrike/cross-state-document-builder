const test = require('tape-catch')
const tapBrowserColor = require('tap-browser-color')
const beginWatchingRouter = require('./es5')
const stateFactory = require('abstract-state-router/test/helpers/test-state-factory')
const EventEmitter = require('events').EventEmitter
const makeAsrStateWatcher = require('asr-active-state-watcher/es5')

if (typeof window !== 'undefined') {
	tapBrowserColor()
}

function createMockRendererFactory() {
	return function makeRenderer(stateRouter) {
		return {
			render: function render(context, cb) {
				cb(null, context.template)
			},
			reset: function reset(context, cb) {
				setTimeout(cb, 100)
			},
			destroy: function destroy(renderedTemplateApi, cb) {
				setTimeout(cb, 100)
			},
			getChildElement: function getChildElement(renderedTemplateApi, cb) {
				cb(null, 'whatever')
			}
		}
	}
}

function makeTestStates(t, datas) {
	datas = datas || {}
	const testState = stateFactory(t, createMockRendererFactory(), { throwOnError: true })
	testState.emitters = {}

	function addState(name) {
		const nameWithNoPeriod = name.replace(/\./g, '')
		const emitter = new EventEmitter() // Ractive mock
		emitter.fire = emitter.emit
		emitter.off = emitter.removeListener
		emitter.set = function set(newState) {
			emitter.state = newState
		}
		if (testState.emitters[nameWithNoPeriod]) {
			throw new Error('emitter ' + nameWithNoPeriod + ' existed already')
		}
		testState.emitters[nameWithNoPeriod] = emitter

		testState.stateRouter.addState({
			name: name,
			template: emitter,
			route: name.replace(/\./g, '/'),
			data: datas[nameWithNoPeriod] || {}
		})
	}

	addState('parent1')
	addState('parent1.child1')
	addState('parent1.child2')
	addState('parent2')
	addState('parent2.child1')
	addState('parent2.child2')

	return testState
}

test('initial use case', t => {
	t.timeoutAfter(1000)

	const testState = makeTestStates(t)
	const stateWatcher = makeAsrStateWatcher(testState.stateRouter)
	const createDocument = beginWatchingRouter(stateWatcher)

	function reducer(state, action) {
		switch(action.type) {
			case '@@redux/INIT':
				return state
			case 'INCREMENT':
				return {
					num: state.num + 1
				}
			case 'DECREMENT':
				return {
					num: state.num - 1
				}
		}
		throw new Error('FFFUUUUU')
	}

	testState.stateRouter.once('stateChangeEnd', () => {
		const doc = createDocument(reducer, { num: 0 })

		testState.emitters.parent1child1.fire('dispatch', 'INCREMENT')

		testState.stateRouter.once('stateChangeEnd', () => {
			testState.emitters.parent1.fire('dispatch', 'INCREMENT')
			t.equal(doc.store.getState().num, 2)

			// should have no effect because we're on child2 now
			testState.emitters.parent1child1.fire('dispatch', 'DECREMENT')

			t.equal(doc.store.getState().num, 2)

			doc.finishDocument()

			t.end()
		})

		testState.stateRouter.go('parent1.child2')
	})

	testState.stateRouter.go('parent1.child1')
})
