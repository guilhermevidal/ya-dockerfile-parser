export enum State {
    BeginningOfLine,
    NewLine,
    EndingOfLine,

    BeginningOfComment,
    SkipingFirstLetterOfComment,
    AppendingComment,
    EndingOfComment,

    BeginningOfInstruction,
    AppendingInstruction,
    EndingOfInstruction,

    BeginningOfArguments,
    AppendingArguments,
    EscapingOnArguments,
    EndingOfArguments,

    Error,
    EndOfFile,
}