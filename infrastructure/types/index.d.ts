interface ICommand {
  getName(): string;
  getReply(userQuery: string): AnswerType[];
  getDescription(): string;
  isValidTrigger(text: string): boolean;
}

// Все ради того, чтобы можно было подавать боту сразу все сообщения, которые он должен выдать в массиве или же одним объектом, если там находится всего один ответ

type AnswerType = NonNullable<AnswerAllTraitType>;

type AnswerAllTraitType = TextTrait | ImageTrait;

type TextTrait = {
  text: string;
};

type ImageTrait = {
  image: string;
};
