# cross-state-document-builder

For when you want the user to build documents in an application built with [abstract-state-router](https://github.com/TehShrike/abstract-state-router), but don't want them to be tied to a particular state.

Initialize with a [asr-active-state-watcher](https://github.com/TehShrike/asr-active-state-watcher).

```js

const makeAsrStateWatcher = require('asr-active-state-watcher')
const stateWatcher = makeAsrStateWatcher(stateRouter)

const createDocument = beginWatchingRouter(stateWatcher)


function reducer(state, action) {
	switch(action.type) {
		case 'INCREMENT':
			return {
				num: state.num + 1
			}
		case 'DECREMENT':
			return {
				num: state.num - 1
			}
		default:
			return state
	}
}

const doc = createDocument(reducer, { num: 0 })

// a currently active dom API emits "dispatch" with the action "INCREMENT"

doc.store.getState().num // => 1

doc.finishDocument() // Removes all listeners

```
