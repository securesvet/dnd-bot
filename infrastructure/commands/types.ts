interface ICommand {
  getReply(userQuery: string): Promise<AnswerType> | AnswerType;
}

// Все ради того, чтобы можно было подавать боту сразу все сообщения, которые он должен выдать в массиве или же одним объектом, если там находится всего один ответ

type AnswerType = NonNullable<AnswerAllTraitType>;

type AnswerAllTraitType = Partial<TextTrait & ImageTrait>;

type TextTrait = {
  text: string;
};

type ImageTrait = {
  image: string;
};

export type { AnswerAllTraitType, AnswerType, ICommand, ImageTrait, TextTrait };
