import Component from '@glimmer/component';
import { timeout } from 'ember-concurrency';
import * as ec from 'ember-concurrency';

export default class FooComponent extends Component {
  @ec.task
  *hello(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @ec.restartableTask
  *restartable(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @ec.dropTask
  *drop(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @ec.keepLatestTask
  *keepLatest(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @ec.enqueueTask
  *enqueue(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @ec.nope async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
