import { EventEmitter } from 'events';
import * as Rx from 'rxjs/Rx';
import { ArgumentsParserFactory } from './ArgumentsParserFactory';
import { Token } from './Token';
import { Tokenizer } from './Tokenizer';
export declare class Parser extends EventEmitter {
    private contents;
    private argumentsParserFactory;
    private lineno;
    constructor(contents: string, argumentsParserFactory: ArgumentsParserFactory);
    parse(): void;
    private _onComment(comment);
    private _onCompleteInstructions(completeInstruction);
    private parseArgs(command, args);
    private createArgumentsParserFor(command);
    private commentSubscription;
    private _commentSubscription;
    protected createCommentSubscription(): Rx.Observable<Token>;
    private newLineSubscription;
    private _newLineSubscription;
    protected createNewLineSubscription(): Rx.Observable<Token>;
    private completeInstructionsSubscription;
    private _completeInstructionsSubscription;
    protected createCompleteInstructionsSubscription(): Rx.Observable<{
        instructions: Token;
        args: Token;
    }>;
    private source;
    private _source;
    protected createSource(): Rx.Observable<Token>;
    private tokenizer;
    private _tokenizer;
    protected createTokenizer(): Tokenizer;
}
