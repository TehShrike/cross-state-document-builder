const test = require('tape')
const beginWatchingRouter = require('./es5.js')
const stateFactory = require('abstract-state-router/test/helpers/test-state-factory')

function makeTestStates(t, datas) {
	const testState = stateFactory(t)

	testState.stateRouter.add({
		name: 'parent1',
		template: 'parent1',
		route: 'parent1',
		data: datas.parent1
	})
	testState.stateRouter.add({
		name: 'parent2',
		template: 'parent2',
		route: 'parent2',
		data: datas.parent2
	})
	testState.stateRouter.add({
		name: 'parent1.child1',
		template: 'parent1.child1',
		route: 'parent1.child1',
		data: datas.parent1child1
	})
	testState.stateRouter.add({
		name: 'parent1.child2',
		template: 'parent1.child2',
		route: 'parent1.child2',
		data: datas.parent1child2
	})
	testState.stateRouter.add({
		name: 'parent2.child1',
		template: 'parent2.child1',
		route: 'parent2.child1',
		data: datas.parent2child1
	})
	testState.stateRouter.add({
		name: 'parent2.child2',
		template: 'parent2.child2',
		route: 'parent2.child2',
		data: datas.parent2child2
	})

	return testState
}

test('initial use case', t => {
	const testState = makeTestStates(t)

	testState.stateRouter.go('parent1.child1')

	const someObject = beginWatchingRouter(testState.stateRouter)

	function reducer(state, action) {

	}

	testState.stateRouter.once('stateChangeEnd', () => {
		someObject.startDocument()
	})
})
