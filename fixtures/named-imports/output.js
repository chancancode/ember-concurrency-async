import Component from '@glimmer/component';
import { task, restartableTask, dropTask, keepLatestTask, enqueueTask, nope, timeout } from 'ember-concurrency';

export default class FooComponent extends Component {
  @task
  *hello(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @restartableTask
  *restartable(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @dropTask
  *drop(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @keepLatestTask
  *keepLatest(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @enqueueTask
  *enqueue(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @nope async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
