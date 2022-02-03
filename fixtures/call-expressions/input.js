import Component from '@glimmer/component';
import {
  task,
  restartableTask,
  dropTask,
  keepLatestTask,
  nope,
  timeout,
} from 'ember-concurrency';
import * as ec from 'ember-concurrency';

export default class FooComponent extends Component {
  @task() async hello(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @restartableTask({ maxConcurrency: 3 }) async restartable(
    arg,
    promise,
    ...rest
  ) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @dropTask() async drop(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @keepLatestTask({}) async keepLatest(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @ec.enqueueTask({ maxConcurrency: 3 }) async enqueue(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @nope async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
