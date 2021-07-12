import { InteractionResponseFlags, InteractionResponseType, InteractionType } from "discord-interactions";
import createInteractionResponse from '../helpers/InteractionHelpers';
import _commands from './commands.json';

type CommandOptions = {
  name: string,
  value: string,
  description: string,
  options?: Array<CommandOptions>,
  required?: boolean
}

type Command = {
  name: string,
  description: string,
  options?: Array<CommandOptions>
}

const Commands: Array<Command> = _commands;

export async function handleRequest(request: Request): Promise<Response> {
  const json = await request.json();
  const { type, data } = json;

  switch (type) {
    case InteractionType.PING:
      return createInteractionResponse({type: InteractionResponseType.PONG});
    case InteractionType.APPLICATION_COMMAND:
      return await handleCommand(data);
    case InteractionType.MESSAGE_COMPONENT:
      return await handleComponent(data);
    default:
      return createInteractionResponse('Something went wrong', 400);
  }
}

async function handleCommand(data: any): Promise<Response> {
  const { id, name, resolved, options, custom_id, component_type  } = data;

  if (!Commands.some(command => command.name === name)) {
    return createInteractionResponse('No matching command', 404)
  }

  return createInteractionResponse('test');
}

async function handleComponent(data: any): Promise<Response> {
  const { id, name, resolved, options, custom_id, component_type  } = data;
  return createInteractionResponse('test');
}


