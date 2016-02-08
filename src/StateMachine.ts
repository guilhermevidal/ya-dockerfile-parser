import {Input} from './Input';
import {State} from './State';

export class StateMachine {
    private current: number = State.BeginningOfLine;

    next(input: Input) {
        return this.current = this.machine[this.current][input];
    }

    private machine = [
    //                              hash                        space                               letter                          other                       slash                       carriageReturn              lineFeed                    endOfFile
    /*BeginningOfLine*/             [State.BeginningOfComment,  State.BeginningOfLine,              State.BeginningOfInstruction,   State.Error,                State.Error,                State.EndingOfLine,         State.NewLine,              State.EndOfFile],
    /*NewLine*/                     [State.BeginningOfComment,  State.BeginningOfLine,              State.BeginningOfInstruction,   State.Error,                State.Error,                State.EndingOfLine,         State.NewLine,              State.EndOfFile],
    /*EndingOfLine*/                [State.Error,               State.Error,                        State.Error,                    State.Error,                State.Error,                State.Error,                State.NewLine,              State.EndOfFile],

    /*BeginningOfComment*/          [State.Error,               State.SkipingFirstLetterOfComment,  State.Error,                    State.Error,                State.Error,                State.EndingOfComment,      State.BeginningOfLine,      State.EndOfFile],
    /*SkipingFirstLetterOfComment*/ [State.AppendingComment,    State.AppendingComment,             State.AppendingComment,         State.AppendingComment,     State.AppendingComment,     State.EndingOfComment,      State.BeginningOfLine,      State.EndOfFile],
    /*AppendingComment*/            [State.AppendingComment,    State.AppendingComment,             State.AppendingComment,         State.AppendingComment,     State.AppendingComment,     State.EndingOfComment,      State.BeginningOfLine,      State.EndOfFile],
    /*EndingOfComment*/             [State.Error,               State.Error,                        State.Error,                    State.Error,                State.Error,                State.Error,                State.BeginningOfLine,      State.EndOfFile],

    /*BeginningOfInstruction*/      [State.Error,               State.BeginningOfArguments,         State.AppendingInstruction,     State.Error,                State.Error,                State.EndingOfInstruction,  State.BeginningOfLine,      State.EndOfFile],
    /*AppendingInstruction*/        [State.Error,               State.BeginningOfArguments,         State.AppendingInstruction,     State.Error,                State.Error,                State.EndingOfInstruction,  State.BeginningOfLine,      State.EndOfFile],
    /*EndingOfInstruction*/         [State.Error,               State.Error,                        State.Error,                    State.Error,                State.Error,                State.Error,                State.BeginningOfLine,      State.EndOfFile],

    /*BeginningOfArguments*/        [State.AppendingArguments,  State.AppendingArguments,           State.AppendingArguments,       State.AppendingArguments,   State.EscapingOnArguments,  State.EndingOfArguments,    State.BeginningOfLine,      State.EndOfFile],
    /*AppendingArguments*/          [State.AppendingArguments,  State.AppendingArguments,           State.AppendingArguments,       State.AppendingArguments,   State.EscapingOnArguments,  State.EndingOfArguments,    State.BeginningOfLine,      State.EndOfFile],
    /*EscapingOnArguments*/         [State.AppendingArguments,  State.AppendingArguments,           State.AppendingArguments,       State.AppendingArguments,   State.EscapingOnArguments,  State.EscapingOnArguments,  State.AppendingArguments,   State.EndOfFile],
    /*EndingOfArguments*/           [State.Error,               State.Error,                        State.Error,                    State.Error,                State.Error,                State.Error,                State.BeginningOfLine,      State.EndOfFile],

    /*Error*/                       [State.Error,               State.Error,                        State.Error,                    State.Error,                State.Error,                State.Error,                State.BeginningOfLine,      State.EndOfFile],
    ]
}



