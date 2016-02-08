var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/main" />
var events_1 = require('events');
var Rx = require('rxjs/Rx');
var pairwise_1 = require('rxjs/operator/pairwise');
var ArgumentsParser_1 = require('./ArgumentsParser');
var TokenType_1 = require('./TokenType');
var Tokenizer_1 = require('./Tokenizer');
var DockerfileCommand_1 = require('./DockerfileCommand');
var Parser = (function (_super) {
    __extends(Parser, _super);
    function Parser(contents, argumentsParserFactory) {
        _super.call(this);
        this.contents = contents;
        this.argumentsParserFactory = argumentsParserFactory;
        this.lineno = 0;
    }
    Parser.prototype.parse = function () {
        var _this = this;
        Rx.Observable.merge(this.newLineSubscription, this.commentSubscription, this.completeInstructionsSubscription).subscribe(function (t) { return _this.lineno++; });
        this.commentSubscription.subscribe(function (t) { return _this._onComment(t); });
        this.completeInstructionsSubscription.subscribe(function (t) { return _this._onCompleteInstructions(t); });
        this.tokenizer.read(this.contents);
    };
    Parser.prototype._onComment = function (comment) {
        this.emit('command', {
            name: DockerfileCommand_1.DockerfileCommand.COMMENT,
            lineno: this.lineno,
            args: this.parseArgs(DockerfileCommand_1.DockerfileCommand.COMMENT, comment.value)
        });
    };
    Parser.prototype._onCompleteInstructions = function (completeInstruction) {
        this.emit('command', {
            name: completeInstruction.instructions.value,
            lineno: this.lineno,
            args: this.parseArgs(completeInstruction.instructions.value, completeInstruction.args.value)
        });
    };
    Parser.prototype.parseArgs = function (command, args) {
        return this.createArgumentsParserFor(command).parse(args);
    };
    Parser.prototype.createArgumentsParserFor = function (command) {
        switch (command) {
            case DockerfileCommand_1.DockerfileCommand.COMMENT: return this.argumentsParserFactory.createCommentsArgsParser();
            case DockerfileCommand_1.DockerfileCommand.FROM: return this.argumentsParserFactory.createFromArgsParser();
            case DockerfileCommand_1.DockerfileCommand.MAINTAINER: return this.argumentsParserFactory.createMaintainerArgsParser();
            case DockerfileCommand_1.DockerfileCommand.RUN: return this.argumentsParserFactory.createRunArgsParser();
            case DockerfileCommand_1.DockerfileCommand.CMD: return this.argumentsParserFactory.createCmdArgsParser();
            case DockerfileCommand_1.DockerfileCommand.LABEL: return this.argumentsParserFactory.createLabelArgsParser();
            case DockerfileCommand_1.DockerfileCommand.EXPOSE: return this.argumentsParserFactory.createExposeArgsParser();
            case DockerfileCommand_1.DockerfileCommand.ENV: return this.argumentsParserFactory.createEnvArgsParser();
            case DockerfileCommand_1.DockerfileCommand.ADD: return this.argumentsParserFactory.createAddArgsParser();
            case DockerfileCommand_1.DockerfileCommand.COPY: return this.argumentsParserFactory.createCopyArgsParser();
            case DockerfileCommand_1.DockerfileCommand.ENTRYPOINT: return this.argumentsParserFactory.createEntryPointArgsParser();
            case DockerfileCommand_1.DockerfileCommand.VOLUME: return this.argumentsParserFactory.createVolumeArgsParser();
            case DockerfileCommand_1.DockerfileCommand.USER: return this.argumentsParserFactory.createUserArgsParser();
            case DockerfileCommand_1.DockerfileCommand.WORKDIR: return this.argumentsParserFactory.createWorkdirArgsParser();
            case DockerfileCommand_1.DockerfileCommand.ARG: return this.argumentsParserFactory.createArgArgsParser();
            case DockerfileCommand_1.DockerfileCommand.ONBUILD: return this.argumentsParserFactory.createOnbuildArgsParser();
            case DockerfileCommand_1.DockerfileCommand.STOPSIGNAL: return this.argumentsParserFactory.createStopSignalArgsParser();
            default: return new ArgumentsParser_1.NullArgumentsParser();
        }
    };
    Object.defineProperty(Parser.prototype, "commentSubscription", {
        get: function () { return this._commentSubscription || (this._commentSubscription = this.createCommentSubscription()); },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.createCommentSubscription = function () {
        return this.source.filter(function (t) { return t.type == TokenType_1.TokenType.Comment; });
    };
    Object.defineProperty(Parser.prototype, "newLineSubscription", {
        get: function () { return this._newLineSubscription || (this._newLineSubscription = this.createNewLineSubscription()); },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.createNewLineSubscription = function () {
        return this.source.filter(function (t) { return t.type == TokenType_1.TokenType.NewLine; });
    };
    Object.defineProperty(Parser.prototype, "completeInstructionsSubscription", {
        get: function () {
            return this._completeInstructionsSubscription || (this._completeInstructionsSubscription = this.createCompleteInstructionsSubscription());
        },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.createCompleteInstructionsSubscription = function () {
        var _this = this;
        return Rx.Observable.create(function (observer) {
            var handler = pairwise_1.pairwise.call(_this.source)
                .subscribe(function (ts) {
                if (ts[0].type == TokenType_1.TokenType.Instruction && ts[1].type == TokenType_1.TokenType.Arguments) {
                    observer.next({ instructions: ts[0], args: ts[1], });
                }
            });
            return function () {
                handler.dispose();
            };
        });
    };
    Object.defineProperty(Parser.prototype, "source", {
        get: function () { return this._source || (this._source = this.createSource()); },
        enumerable: true,
        configurable: true
    });
    Parser.prototype.createSource = function () {
        return Rx.Observable.fromEvent(this.tokenizer, 'token');
    };
    Object.defineProperty(Parser.prototype, "tokenizer", {
        get: function () { return this._tokenizer || (this._tokenizer = this.createTokenizer()); },
        enumerable: true,
        configurable: true
    });
    ;
    Parser.prototype.createTokenizer = function () {
        return new Tokenizer_1.Tokenizer();
    };
    return Parser;
})(events_1.EventEmitter);
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map