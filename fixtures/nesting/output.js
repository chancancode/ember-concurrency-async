import Component from '@glimmer/component';
import { task } from 'ember-concurrency-decorators';

export default class FooComponent extends Component {
  @task
  *deeplyNested() {
    return yield (async () => {
      await (async () => {
        await (function *() {
          yield 'foo';
        })();
      })();
    })();
  }
}
