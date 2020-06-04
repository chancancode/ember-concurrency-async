import Component from '@glimmer/component';
import { timeout } from 'ember-concurrency';
import {
  task as t,
  restartableTask as r,
  dropTask as d,
  keepLatestTask as k,
  enqueueTask as e,
  nope as n
} from 'ember-concurrency-decorators';

export default class FooComponent extends Component {
  @t
  *hello(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @r
  *restartable(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @d
  *drop(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @k
  *keepLatest(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @e
  *enqueue(arg, promise, ...rest) {
    let result = yield promise;
    console.log('hello', result, ...rest);
    yield timeout(1000);
    return arg;
  }

  @n async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
