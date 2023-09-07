import {
  Task,
  TaskInstance,
  EncapsulatedTask,
  EncapsulatedTaskProperty,
  EncapsulatedTaskState,
  task,
  taskGroup,
} from 'ember-concurrency';

declare module 'ember-concurrency' {
  export type AsyncTaskFunctionArgs<T extends AsyncTaskFunction<any, any[]>> =
    T extends (...args: infer A) => Promise<any> ? A : [];

  export type AsyncTaskFunctionReturnType<T extends AsyncTaskFunction<any, any[]>> =
    T extends (...args: any[]) => Promise<infer R> ? R : unknown;

  export interface AsyncEncapsulatedTaskDescriptor<T, Args extends any[]> {
    perform(...args: Args): Promise<T>;
  }

  export type AsyncEncapsulatedTaskDescriptorArgs<T extends AsyncEncapsulatedTaskDescriptor<any, any[]>> =
    T extends { perform(...args: infer A): Promise<any> } ? A : [];

  export type AsyncEncapsulatedTaskDescriptorReturnType<T extends AsyncEncapsulatedTaskDescriptor<any, any[]>> =
    T extends { perform(...args: any[]): Promise<infer R> } ? R : unknown;

  export type AsyncEncapsulatedTaskState<T extends object> = EncapsulatedTaskState<T>;

  export type TaskForAsyncEncapsulatedTaskDescriptor<T extends AsyncEncapsulatedTaskDescriptor<any, any[]>> =
    EncapsulatedTask<
      AsyncEncapsulatedTaskDescriptorReturnType<T>,
      AsyncEncapsulatedTaskDescriptorArgs<T>,
      AsyncEncapsulatedTaskState<T>
    >;

  export type TaskInstanceForAsyncEncapsulatedTaskDescriptor<T extends AsyncEncapsulatedTaskDescriptor<any, any[]>> =
    TaskInstance<AsyncEncapsulatedTaskDescriptorReturnType<T>> & AsyncEncapsulatedTaskDescriptorArgs<T>;

  function task<T extends AsyncTaskFunction<any, any[]>>(taskFn: T):
    TaskProperty<AsyncTaskFunctionReturnType<T>, AsyncTaskFunctionArgs<T>>;
  function task<T extends AsyncEncapsulatedTaskDescriptor<any, any[]>>(taskFn: T):
    EncapsulatedTaskProperty<
      AsyncEncapsulatedTaskDescriptorReturnType<T>,
      AsyncEncapsulatedTaskDescriptorArgs<T>,
      AsyncEncapsulatedTaskState<T>
    >;
}
