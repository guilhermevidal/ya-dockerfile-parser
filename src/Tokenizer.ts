/// <reference path="../typings/main" />
import {EventEmitter} from 'events';

import {Input} from './Input';
import {State} from './State';
import {StateMachine} from './StateMachine';

import {Token} from'./Token';
import {TokenType} from './TokenType';

export class Tokenizer extends EventEmitter {
    read(contents: string) {
        var machine = new StateMachine();
        this.forEachInput(contents, (input, char) => {

            switch (machine.next(input)) {
                case State.NewLine: this.startToken(TokenType.NewLine); break;

                case State.BeginningOfComment: this.startToken(TokenType.Comment); break;
                case State.AppendingComment: this.append(char); break;

                case State.BeginningOfInstruction: this.startToken(TokenType.Instruction);
                case State.AppendingInstruction: this.append(char); break;

                case State.BeginningOfArguments: this.startToken(TokenType.Arguments); break;
                case State.AppendingArguments:
                case State.EscapingOnArguments:
                    this.append(char);
                    break;

                case State.Error: this.clearToken(); break;
                case State.EndOfFile: this.endToken(); break;
                default: break;
            }

        });
    }

    private startToken(type: TokenType) {
        if (this._token)
            this.endToken();

        this._token = new _Token(type);
    }
    private append(c: string) {
        this._token.append(c);
    }
    private endToken() {
        if (this._token) {
            this.emit('token', <Token>{
                type: this._token.type,
                value: this._token.value
            })
        };
    }
    private clearToken() {
        this._token = undefined;
    }
    private _token: _Token;

    private forEachInput(contents: string, cb: (input: Input, char: string) => void) {
        for (var index = 0; index < contents.length; index++) {
            var c = new Char(contents[index]);
            cb(c.asInput(), c.value);
        }
        cb(Input.EndOfFile, undefined);
    }
}

class _Token implements Token {
    private _value: string[] = []
    constructor(private _type: TokenType) { }

    get type() { return this._type; }
    get value() { return this._value.join(''); }

    append(c: string) {
        this._value.push(c);
    }
}

class Char {
    private c: string;

    constructor(c: string) {
        this.c = c[0];
    }

    get value() { return this.c; }

    isHash() { return this.c === '#'; }
    isSpace() { return /\s/.test(this.c); }
    isLetter() { return /[a-z]/i.test(this.c); }
    isSlash() { return this.c === '\\'; }
    isCarriageReturn() { return this.c === '\r'; }
    isLineFeed() { return this.c === '\n'; }

    asInput() {
        if (this.isHash()) return Input.Hash;
        if (this.isLetter()) return Input.Letter;
        if (this.isSlash()) return Input.Slash;
        if (this.isCarriageReturn()) return Input.CarriageReturn;
        if (this.isLineFeed()) return Input.LineFeed;
        if (this.isSpace()) return Input.Space;
        return Input.Other;
    }
}
