import Component from '@glimmer/component';
import {
  timeout,
  task as t,
  restartableTask as r,
  dropTask as d,
  keepLatestTask as k,
  enqueueTask as e,
  nope as n
} from 'ember-concurrency';

export default class FooComponent extends Component {
  @t async hello(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @r async restartable(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @d async drop(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @k async keepLatest(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @e async enqueue(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }

  @n async notTask(arg, promise, ...rest) {
    let result = await promise;
    console.log('hello', result, ...rest);
    await timeout(1000);
    return arg;
  }
}
