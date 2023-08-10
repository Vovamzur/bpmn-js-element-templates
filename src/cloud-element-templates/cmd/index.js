import ChangeElementTemplateHandler from './ChangeElementTemplateHandler';
import RemoveElementTemplateHandler from '../../element-templates/cmd/RemoveElementTemplateHandler';
import MultiCommandHandler from '../../element-templates/cmd/MultiCommandHandler';

function registerHandlers(commandStack, elementTemplates, eventBus) {

  commandStack.registerHandler(
    'element-templates.multi-command-executor',
    MultiCommandHandler
  );

  commandStack.registerHandler(
    'propertiesPanel.zeebe.changeTemplate',
    ChangeElementTemplateHandler
  );

  commandStack.registerHandler(
    'propertiesPanel.removeTemplate',
    RemoveElementTemplateHandler
  );

  // apply default element templates on shape creation
  eventBus.on([ 'commandStack.shape.create.postExecuted' ], function(event) {
    const {
      context: {
        hints = {},
        shape
      }
    } = event;

    if (hints.createElementsBehavior !== false) {
      applyDefaultTemplate(shape, elementTemplates, commandStack);
    }
  });

  // apply default element templates on connection creation
  eventBus.on([ 'commandStack.connection.create.postExecuted' ], function(event) {
    const {
      context: {
        hints = {},
        connection
      }
    } = event;

    if (hints.createElementsBehavior !== false) {
      applyDefaultTemplate(connection, elementTemplates, commandStack);
    }
  });
}

registerHandlers.$inject = [ 'commandStack', 'elementTemplates', 'eventBus' ];


export default {
  __init__: [ registerHandlers ]
};


function applyDefaultTemplate(element, elementTemplates, commandStack) {

  if (!elementTemplates.get(element) && elementTemplates.getDefault(element)) {

    const command = 'propertiesPanel.zeebe.changeTemplate';
    const commandContext = {
      element: element,
      newTemplate: elementTemplates.getDefault(element)
    };

    commandStack.execute(command, commandContext);
  }
}
