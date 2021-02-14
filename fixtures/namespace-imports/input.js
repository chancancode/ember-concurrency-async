import Component from '@glimmer/component';
import { timeout } from 'ember-concurrency';
import * as ec from 'ember-concurrency';

export default class FooComponent extends Component {
  @ec.task async hello(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.restartableTask async restartable(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.dropTask async drop(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.keepLatestTask async keepLatest(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.enqueueTask async enqueue(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.nope async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
