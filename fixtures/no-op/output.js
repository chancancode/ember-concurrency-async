import Component from '@glimmer/component';
import { nope } from 'ember-concurrency';
import * as decorators from 'ember-concurrency';

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
