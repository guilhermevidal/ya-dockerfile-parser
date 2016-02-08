var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/main" />
var events_1 = require('events');
var Input_1 = require('./Input');
var State_1 = require('./State');
var StateMachine_1 = require('./StateMachine');
var TokenType_1 = require('./TokenType');
var Tokenizer = (function (_super) {
    __extends(Tokenizer, _super);
    function Tokenizer() {
        _super.apply(this, arguments);
    }
    Tokenizer.prototype.read = function (contents) {
        var _this = this;
        var machine = new StateMachine_1.StateMachine();
        this.forEachInput(contents, function (input, char) {
            switch (machine.next(input)) {
                case State_1.State.NewLine:
                    _this.startToken(TokenType_1.TokenType.NewLine);
                    break;
                case State_1.State.BeginningOfComment:
                    _this.startToken(TokenType_1.TokenType.Comment);
                    break;
                case State_1.State.AppendingComment:
                    _this.append(char);
                    break;
                case State_1.State.BeginningOfInstruction: _this.startToken(TokenType_1.TokenType.Instruction);
                case State_1.State.AppendingInstruction:
                    _this.append(char);
                    break;
                case State_1.State.BeginningOfArguments:
                    _this.startToken(TokenType_1.TokenType.Arguments);
                    break;
                case State_1.State.AppendingArguments:
                case State_1.State.EscapingOnArguments:
                    _this.append(char);
                    break;
                case State_1.State.Error:
                    _this.clearToken();
                    break;
                case State_1.State.EndOfFile:
                    _this.endToken();
                    break;
                default: break;
            }
        });
    };
    Tokenizer.prototype.startToken = function (type) {
        if (this._token)
            this.endToken();
        this._token = new _Token(type);
    };
    Tokenizer.prototype.append = function (c) {
        this._token.append(c);
    };
    Tokenizer.prototype.endToken = function () {
        if (this._token) {
            this.emit('token', {
                type: this._token.type,
                value: this._token.value
            });
        }
        ;
    };
    Tokenizer.prototype.clearToken = function () {
        this._token = undefined;
    };
    Tokenizer.prototype.forEachInput = function (contents, cb) {
        for (var index = 0; index < contents.length; index++) {
            var c = new Char(contents[index]);
            cb(c.asInput(), c.value);
        }
        cb(Input_1.Input.EndOfFile, undefined);
    };
    return Tokenizer;
})(events_1.EventEmitter);
exports.Tokenizer = Tokenizer;
var _Token = (function () {
    function _Token(_type) {
        this._type = _type;
        this._value = [];
    }
    Object.defineProperty(_Token.prototype, "type", {
        get: function () { return this._type; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(_Token.prototype, "value", {
        get: function () { return this._value.join(''); },
        enumerable: true,
        configurable: true
    });
    _Token.prototype.append = function (c) {
        this._value.push(c);
    };
    return _Token;
})();
var Char = (function () {
    function Char(c) {
        this.c = c[0];
    }
    Object.defineProperty(Char.prototype, "value", {
        get: function () { return this.c; },
        enumerable: true,
        configurable: true
    });
    Char.prototype.isHash = function () { return this.c === '#'; };
    Char.prototype.isSpace = function () { return /\s/.test(this.c); };
    Char.prototype.isLetter = function () { return /[a-z]/i.test(this.c); };
    Char.prototype.isSlash = function () { return this.c === '\\'; };
    Char.prototype.isCarriageReturn = function () { return this.c === '\r'; };
    Char.prototype.isLineFeed = function () { return this.c === '\n'; };
    Char.prototype.asInput = function () {
        if (this.isHash())
            return Input_1.Input.Hash;
        if (this.isLetter())
            return Input_1.Input.Letter;
        if (this.isSlash())
            return Input_1.Input.Slash;
        if (this.isCarriageReturn())
            return Input_1.Input.CarriageReturn;
        if (this.isLineFeed())
            return Input_1.Input.LineFeed;
        if (this.isSpace())
            return Input_1.Input.Space;
        return Input_1.Input.Other;
    };
    return Char;
})();
//# sourceMappingURL=Tokenizer.js.map