// Заглушка. Пока не добавл postgres и не создал ботиков

import HelloWorldCommand from './infrastructure/commands/HelloWorldCommand.ts';

const listOfCommands = [new HelloWorldCommand()];

async function getMessage(): Promise<string> {
  return '/hello'
}

const message = await getMessage();

const botConsecutiveAnswers: AnswerType[] | undefined = [];

// Checking if message is valid for 
for (const command of listOfCommands) {
  if (command.isValidTrigger(message)) {
    botConsecutiveAnswers.push(...command.getAnswer());
  }
}

for (const answer of botConsecutiveAnswers) {
  console.log(answer)
}