ember-concurrency-async
==============================================================================

This addon introduces an alternative syntax for ember-concurrency tasks that
uses async methods instead of generator methods:

```js
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';

class FooComponent extends Component {
  @task async myTask(foo, bar) {
    let resolvedFoo = await foo;
    let resolvedBar = await this.process(bar);
    return resolvedFoo + resolvedBar;
  }

  async process(bar) {
    // ...
  }
}
```

The main advantage of the async method syntax over the generator method syntax
is that it works better with the TypeScript compiler and things powered by it,
such as the JavaScript language server in Visual Studio Code.

Due to limitations in TypeScript's understanding of generator functions, it is
not possible to express the realtionship between the left and right hand side
of a yield expression. In the case of ember-concurrency task functions, we
would like to inform the compiler that yielding a value "returns" its resolved
value. If yield is a function, this is how we would type it:

```js
type Resolved<T> = T extends PromiseLike<infer R> ? R : T;

function yield<T>(yieldable: T): Resolved<T>;
```

Unfortunately, this is not possible in TypeScript today. However, the `await`
keyword in async functions have exactly the semantics we want, and TypeScript
already understands that natively. This addon allows you to take advantage of
that by authoring tasks in the async methods syntax, but transforms the async
methods into the generator methods expected by ember-concurrency's runtime
code using a babel plugin.

The example from earlier will be transformed into this:

```js
import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';

export default class FooComponent extends Component {
  @task *myTask(foo, bar) {
    let resolvedFoo = yield foo;
    let resolvedBar = yield this.process(bar);
    return resolvedFoo + resolvedBar;
  }

  async process(bar) {
    // ...
  }
}
```

Note that only the async method annotated by the `@task` decorator was
rewritten into a generator method.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-concurrency-async
```


Usage
------------------------------------------------------------------------------

This addon requires the [ember-concurrency-decorators](https://github.com/machty/ember-concurrency-decorators)
addon. Any async methods annotated with one of the task decorators, that is
`@task`, `@restartableTask`, `@dropTask`, `@keepLatestTask` or `@enqueueTask`,
will be transformed into a generator function.

Note that this transformation happens at build time and only works if it can
statically determine an async method is an ember-concurrency task. If does so
by looking at the decorators applied to an async method and try to determine
if they matches one of the known task decorator imports. For example, these
would work:

```js
import { task } from 'ember-concurrency-decorators';

class Foo {
  @task({ restartable: true }) async foo() {
    // ...
  }
}
```

```js
import { restartableTask } from 'ember-concurrency-decorators';

class Foo {
  @restartableTask async foo() {
    // ...
  }
}
```

```js
import { enqueueTask as enqueued } from 'ember-concurrency-decorators';

class Foo {
  @enqueued async foo() {
    // ...
  }
}
```

```js
import * as ec from 'ember-concurrency-decorators';

class Foo {
  @ec.dropTask async foo() {
    // ...
  }
}
```

However, these won't:

```js
import { restartableTask } from 'ember-concurrency-decorators';

const restartable = restartableTask;

class Foo {
  @restartable async foo() {
    // ...
  }
}
```

```js
import { enqueueTask, dropTask } from 'ember-concurrency-decorators';

function enqueueOrDrop() {
  if (Ember.testing) {
    return dropTask();
  } else {
    return enqueueTask();
  }
}

class Foo {
  @enqueueOrDrop async foo() {
    // ...
  }
}
```

```js
import * as ec from 'ember-concurrency-decorators';

class Foo {
  @ec[Ember.testing ? 'dropTask' : 'enqueueTask'] async foo() {
    // ...
  }
}
```

If you encountered use cases that you believe should work but doesn't, please
open an issue.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
