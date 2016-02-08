/// <reference path="../typings/main" />
import {EventEmitter} from 'events';
import * as Rx from 'rxjs/Rx';
import {pairwise} from 'rxjs/operator/pairwise';

import {ArgumentsParser, NullArgumentsParser} from './ArgumentsParser'
import {ArgumentsParserFactory} from './ArgumentsParserFactory'

import {Token} from './Token';
import {TokenType} from './TokenType';
import {Tokenizer} from './Tokenizer';

import {Command} from './Command';
import {DockerfileCommand} from './DockerfileCommand';

export class Parser extends EventEmitter {
    private lineno = 0;

    constructor(private contents: string, private argumentsParserFactory: ArgumentsParserFactory) {
        super();
    }

    parse() {
        Rx.Observable.merge(this.newLineSubscription, this.commentSubscription, this.completeInstructionsSubscription).subscribe(t => this.lineno++);
        this.commentSubscription.subscribe(t => this._onComment(t));
        this.completeInstructionsSubscription.subscribe(t => this._onCompleteInstructions(t));

        this.tokenizer.read(this.contents);
    }

    private _onComment(comment: Token) {
        this.emit('command', <Command>{
            name: DockerfileCommand.COMMENT,
            lineno: this.lineno,
            args: this.parseArgs(DockerfileCommand.COMMENT, comment.value)
        });
    }

    private _onCompleteInstructions(completeInstruction: { instructions: Token, args: Token }) {
        this.emit('command', <Command>{
            name: completeInstruction.instructions.value,
            lineno: this.lineno,
            args: this.parseArgs(completeInstruction.instructions.value, completeInstruction.args.value)
        });
    }

    private parseArgs(command: string, args: string) {
        return this.createArgumentsParserFor(command).parse(args);
    }

    private createArgumentsParserFor(command: string) {
        switch (command) {
            case DockerfileCommand.COMMENT: return this.argumentsParserFactory.createCommentsArgsParser();
            case DockerfileCommand.FROM: return this.argumentsParserFactory.createFromArgsParser();
            case DockerfileCommand.MAINTAINER: return this.argumentsParserFactory.createMaintainerArgsParser();
            case DockerfileCommand.RUN: return this.argumentsParserFactory.createRunArgsParser();
            case DockerfileCommand.CMD: return this.argumentsParserFactory.createCmdArgsParser();
            case DockerfileCommand.LABEL: return this.argumentsParserFactory.createLabelArgsParser();
            case DockerfileCommand.EXPOSE: return this.argumentsParserFactory.createExposeArgsParser();
            case DockerfileCommand.ENV: return this.argumentsParserFactory.createEnvArgsParser();
            case DockerfileCommand.ADD: return this.argumentsParserFactory.createAddArgsParser();
            case DockerfileCommand.COPY: return this.argumentsParserFactory.createCopyArgsParser();
            case DockerfileCommand.ENTRYPOINT: return this.argumentsParserFactory.createEntryPointArgsParser();
            case DockerfileCommand.VOLUME: return this.argumentsParserFactory.createVolumeArgsParser();
            case DockerfileCommand.USER: return this.argumentsParserFactory.createUserArgsParser();
            case DockerfileCommand.WORKDIR: return this.argumentsParserFactory.createWorkdirArgsParser();
            case DockerfileCommand.ARG: return this.argumentsParserFactory.createArgArgsParser();
            case DockerfileCommand.ONBUILD: return this.argumentsParserFactory.createOnbuildArgsParser();
            case DockerfileCommand.STOPSIGNAL: return this.argumentsParserFactory.createStopSignalArgsParser();
            default: return new NullArgumentsParser();
        }
    }

    private get commentSubscription() { return this._commentSubscription || (this._commentSubscription = this.createCommentSubscription()) }
    private _commentSubscription: Rx.Observable<Token>;
    protected createCommentSubscription(): Rx.Observable<Token> {
        return this.source.filter((t: Token) => t.type == TokenType.Comment);
    }

    private get newLineSubscription() { return this._newLineSubscription || (this._newLineSubscription = this.createNewLineSubscription()) }
    private _newLineSubscription: Rx.Observable<Token>;
    protected createNewLineSubscription(): Rx.Observable<Token> {
        return this.source.filter((t: Token) => t.type == TokenType.NewLine);
    }

    private get completeInstructionsSubscription() {
        return this._completeInstructionsSubscription || (this._completeInstructionsSubscription = this.createCompleteInstructionsSubscription())
    }
    private _completeInstructionsSubscription: Rx.Observable<{ instructions: Token, args: Token }>;
    protected createCompleteInstructionsSubscription(): Rx.Observable<{ instructions: Token, args: Token }> {
        return Rx.Observable.create((observer: Rx.Observer<any>) => {
            var handler = pairwise.call(this.source)
                .subscribe((ts: Token[]) => {
                    if (ts[0].type == TokenType.Instruction && ts[1].type == TokenType.Arguments) {
                        observer.next({ instructions: ts[0], args: ts[1], });
                    }
                });

            return function() {
                handler.dispose();
            }
        });
    }

    private get source() { return this._source || (this._source = this.createSource()) }
    private _source: Rx.Observable<Token>;
    protected createSource(): Rx.Observable<Token> {
        return Rx.Observable.fromEvent(this.tokenizer, 'token');
    }

    private get tokenizer() { return this._tokenizer || (this._tokenizer = this.createTokenizer()) };
    private _tokenizer: Tokenizer;
    protected createTokenizer() {
        return new Tokenizer();
    }
}