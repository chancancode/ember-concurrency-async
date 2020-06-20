const { declare } = require('@babel/helper-plugin-utils');
const { yieldExpression, functionExpression } = require('@babel/types');

const TASK_DECORATORS = [
  'task',
  'restartableTask',
  'dropTask',
  'keepLatestTask',
  'enqueueTask'
];

function resolveImport(path) {
  if (path.node.type === 'Identifier') {
    let binding = path.scope.getBinding(path.node.name);

    if (binding && binding.kind === 'module') {
      let { node, parent } = binding.path;

      return {
        source: parent.source.value,
        isNamespace: node.type === 'ImportNamespaceSpecifier',
        isDefault: node.type === 'ImportDefaultSpecifier',
        isNamed: node.type === 'ImportSpecifier',
        name: node.type === 'ImportSpecifier' && node.imported.name
      };
    }
  }
}

function isTaskDecoratorImport(resolved) {
  return resolved.isNamed &&
    resolved.source === 'ember-concurrency-decorators' &&
    TASK_DECORATORS.includes(resolved.name);
}

function isTaskDecoratorNamespaceImport(resolved) {
  return resolved.isNamespace &&
    resolved.source === 'ember-concurrency-decorators';
}

function isTaskDecorator(path) {
  let resolved, node = path.node;

  switch (node.type) {
    case 'Identifier': // @task async method() { ... }
      if ((resolved = resolveImport(path))) {
        return isTaskDecoratorImport(resolved);
      }

      break;

    case 'MemberExpression': // @my.task
      if ((resolved = resolveImport(path.get('object')))) {
        if (isTaskDecoratorNamespaceImport(resolved)) {
          return path.node.property.type === 'Identifier' &&
            TASK_DECORATORS.includes(path.node.property.name);
        }
      }

      break;

    case 'CallExpression': // @task(...) async method() { ... }
      return isTaskDecorator(path.get('callee'));
  }

  return false;
}

function hasTaskDecorator(path) {
  if (path.node.decorators) {
    for (let i=0; i<path.node.decorators.length; i++) {
      if (isTaskDecorator(path.get(`decorators.${i}.expression`))) {
        return true;
      }
    }
  }

  return false;
}

const TransformAsyncMethodsIntoGeneratorMethods = {
  ClassMethod(path) {
    if (path.node.async && hasTaskDecorator(path)) {
      path.node.async = false;
      path.node.generator = true;
      path.traverse(TransformAwaitIntoYield);
    }
  },
  ClassProperty(path) {
    if (hasTaskDecorator(path)) {
      path.traverse(TaskProperty);
    }
  }
};

const TaskProperty = {
  CallExpression(path) {
    if (isTaskDecorator(path)) {
      path.traverse(TaskWrapper);
    }
  }
};

const TaskWrapper = {
  FunctionExpression(path) {
    if (path.node.async) {
      path.node.async = false;
      path.node.generator = true;
      path.traverse(TransformAwaitIntoYield);
    }
  },
  ArrowFunctionExpression(path) {
    if (path.node.async) {
      path.replaceWith(functionExpression(path.node.id, path.node.params, path.node.body, true));
      path.traverse(TransformAwaitIntoYield);
    }
  }
}

const TransformAwaitIntoYield = {
  Function(path) {
    path.skip();
  },
  AwaitExpression(path) {
    path.replaceWith(yieldExpression(path.get('argument').node));
  }
};

module.exports = declare(api => {
  api.assertVersion(7);

  return {
    name: 'transform-ember-concurrency-async-tasks',

    // The decorator plugin removes the method decorators at the
    // class level, our code has to run before that to see them.
    visitor: {
      ClassDeclaration(path) {
        path.traverse(TransformAsyncMethodsIntoGeneratorMethods);
      },
      ClassExpression(path) {
        path.traverse(TransformAsyncMethodsIntoGeneratorMethods);
      }
    },
  };
});
