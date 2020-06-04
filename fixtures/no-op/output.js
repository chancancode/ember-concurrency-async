import Component from '@glimmer/component';
import { nope } from 'ember-concurrency-decorators';
import * as decorators from 'ember-concurrency-decorators';

export default class FooComponent extends Component {
  async notTask() {
    await 'not a task!';
  }

  @nope async alsoNotTask() {
    await 'also not a task!';
  }

  @decorators.nope async stillNotTask() {
    await 'still not a task!';
  }
}
