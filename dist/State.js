(function (State) {
    State[State["BeginningOfLine"] = 0] = "BeginningOfLine";
    State[State["NewLine"] = 1] = "NewLine";
    State[State["EndingOfLine"] = 2] = "EndingOfLine";
    State[State["BeginningOfComment"] = 3] = "BeginningOfComment";
    State[State["SkipingFirstLetterOfComment"] = 4] = "SkipingFirstLetterOfComment";
    State[State["AppendingComment"] = 5] = "AppendingComment";
    State[State["EndingOfComment"] = 6] = "EndingOfComment";
    State[State["BeginningOfInstruction"] = 7] = "BeginningOfInstruction";
    State[State["AppendingInstruction"] = 8] = "AppendingInstruction";
    State[State["EndingOfInstruction"] = 9] = "EndingOfInstruction";
    State[State["BeginningOfArguments"] = 10] = "BeginningOfArguments";
    State[State["AppendingArguments"] = 11] = "AppendingArguments";
    State[State["EscapingOnArguments"] = 12] = "EscapingOnArguments";
    State[State["EndingOfArguments"] = 13] = "EndingOfArguments";
    State[State["Error"] = 14] = "Error";
    State[State["EndOfFile"] = 15] = "EndOfFile";
})(exports.State || (exports.State = {}));
var State = exports.State;
//# sourceMappingURL=State.js.map