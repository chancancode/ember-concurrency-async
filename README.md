ember-concurrency-async
==============================================================================

This addon introduces an alternative syntax for ember-concurrency tasks that
uses async methods instead of generator methods:

```js
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

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
import { task } from 'ember-concurrency';

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

This addon requires [ember-concurrency](https://github.com/machty/ember-concurrency)
v2.0.0-rc.1 or higher. If you're using an earlier version of ember-concurrency
and/or using [ember-concurrency-decorators](https://github.com/machty/ember-concurrency-decorators), you may use ember-concurrency-async < 1.0.0.


Installation
------------------------------------------------------------------------------

```
ember install ember-concurrency-async
```


Usage
------------------------------------------------------------------------------

Any async methods annotated with one of the task decorators, that is
`@task`, `@restartableTask`, `@dropTask`, `@keepLatestTask` or `@enqueueTask`,
will be transformed into a generator function.

Note that this transformation happens at build time and only works if it can
statically determine an async method is an ember-concurrency task. If does so
by looking at the decorators applied to an async method and try to determine
if they matches one of the known task decorator imports. For example, these
would work:

```js
import { task } from 'ember-concurrency';

class Foo {
  @task({ restartable: true }) async foo() {
    // ...
  }
}
```

```js
import { restartableTask } from 'ember-concurrency';

class Foo {
  @restartableTask async foo() {
    // ...
  }
}
```

```js
import { enqueueTask as enqueued } from 'ember-concurrency';

class Foo {
  @enqueued async foo() {
    // ...
  }
}
```

```js
import * as ec from 'ember-concurrency';

class Foo {
  @ec.dropTask async foo() {
    // ...
  }
}
```

However, these won't:

```js
import { restartableTask } from 'ember-concurrency';

const restartable = restartableTask;

class Foo {
  @restartable async foo() {
    // ...
  }
}
```

```js
import { enqueueTask, dropTask } from 'ember-concurrency';

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
import * as ec from 'ember-concurrency';

class Foo {
  @ec[Ember.testing ? 'dropTask' : 'enqueueTask'] async foo() {
    // ...
  }
}
```

If you encountered use cases that you believe should work but doesn't, please
open an issue.


TypeScript
------------------------------------------------------------------------------

ember-concurrency 1.2 and above comes with type definitions. If you are using
TypeScript (or the JavaScript Language Server powered by TypeScript), you may
want to add the following import in `types/<app name>/index.d.ts`:

```js
import 'ember-concurrency-async';
```

This augments ember-concurrency's type definitions to add support for async
task functions. See [index.d.ts](index.d.ts).

If you are using
[ember-concurrency-ts](https://github.com/chancancode/ember-concurrency-ts),
you may also need to add:

```ts
import 'ember-concurrency-ts/async';
```

### Usage with `taskFor` at assignment

[ember-concurrency-ts](https://github.com/chancancode/ember-concurrency-ts)
provides a `taskFor` utility function for casting task functions to the correct
type. `taskFor` can be
[used at assignment](https://github.com/chancancode/ember-concurrency-ts#alternate-usage-of-taskfor)
and is compatible with `ember-concurrency-async`:

```ts
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

class Foo {
  bar: Promise<void>;

  @task
  myTask = taskFor(async function(this: Foo) {
    await this.bar;
  });
}
```

This also works with async arrow functions, eliminating the need to type
`this`:

```ts
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

class Foo {
  bar: Promise<void>;

  @task
  myTask = taskFor(async () => {
    await this.bar;
  });
}
```

Note that async arrow functions are transformed to non-arrow generator
functions (arrow generator functions
[have been proposed](https://github.com/tc39/proposal-generator-arrow-functions)
but no Babel plugin exists for them at this time). The `this` context *is*
bound, however, by the `@task` decorator, so `this` inside the async function
will still refer to the containing class at runtime.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
