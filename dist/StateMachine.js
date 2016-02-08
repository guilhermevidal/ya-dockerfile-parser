var State_1 = require('./State');
var StateMachine = (function () {
    function StateMachine() {
        this.current = State_1.State.BeginningOfLine;
        this.machine = [
            //                              hash                        space                               letter                          other                       slash                       carriageReturn              lineFeed                    endOfFile
            /*BeginningOfLine*/ [State_1.State.BeginningOfComment, State_1.State.BeginningOfLine, State_1.State.BeginningOfInstruction, State_1.State.Error, State_1.State.Error, State_1.State.EndingOfLine, State_1.State.NewLine, State_1.State.EndOfFile],
            /*NewLine*/ [State_1.State.BeginningOfComment, State_1.State.BeginningOfLine, State_1.State.BeginningOfInstruction, State_1.State.Error, State_1.State.Error, State_1.State.EndingOfLine, State_1.State.NewLine, State_1.State.EndOfFile],
            /*EndingOfLine*/ [State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.NewLine, State_1.State.EndOfFile],
            /*BeginningOfComment*/ [State_1.State.Error, State_1.State.SkipingFirstLetterOfComment, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.EndingOfComment, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*SkipingFirstLetterOfComment*/ [State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.EndingOfComment, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*AppendingComment*/ [State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.AppendingComment, State_1.State.EndingOfComment, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*EndingOfComment*/ [State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*BeginningOfInstruction*/ [State_1.State.Error, State_1.State.BeginningOfArguments, State_1.State.AppendingInstruction, State_1.State.Error, State_1.State.Error, State_1.State.EndingOfInstruction, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*AppendingInstruction*/ [State_1.State.Error, State_1.State.BeginningOfArguments, State_1.State.AppendingInstruction, State_1.State.Error, State_1.State.Error, State_1.State.EndingOfInstruction, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*EndingOfInstruction*/ [State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*BeginningOfArguments*/ [State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.EscapingOnArguments, State_1.State.EndingOfArguments, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*AppendingArguments*/ [State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.EscapingOnArguments, State_1.State.EndingOfArguments, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*EscapingOnArguments*/ [State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.AppendingArguments, State_1.State.EscapingOnArguments, State_1.State.EscapingOnArguments, State_1.State.AppendingArguments, State_1.State.EndOfFile],
            /*EndingOfArguments*/ [State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
            /*Error*/ [State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.Error, State_1.State.BeginningOfLine, State_1.State.EndOfFile],
        ];
    }
    StateMachine.prototype.next = function (input) {
        return this.current = this.machine[this.current][input];
    };
    return StateMachine;
})();
exports.StateMachine = StateMachine;
//# sourceMappingURL=StateMachine.js.map