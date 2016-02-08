/// <reference path="../typings/main" />
var chai = require('chai');
chai.should();
var expect = chai.expect;
var TokenType_1 = require('../dist/TokenType');
var Tokenizer_1 = require('../dist/Tokenizer');
describe('Tokenizer', function () {
    describe('Should emit when token found', function () {
        it('comments', function () {
            assertCommentToken('#', '');
            assertCommentToken('# Hello', 'Hello');
            assertCommentToken('# Hello\n', 'Hello');
            assertCommentToken('# Hello\r\n', 'Hello');
            assertCommentToken('# Hello/\r\n', 'Hello/');
            assertCommentToken('# Hello World/\r\n', 'Hello World/');
        });
        it('instructions', function () {
            assertInstructionsToken('RUN', 'RUN');
            assertInstructionsToken('RUN\n', 'RUN');
            assertInstructionsToken('RUN\r\n', 'RUN');
            assertInstructionsToken('RUN \r\n', 'RUN');
        });
        it('arguments', function () {
            assertArgumentsToken('RUN command', 'command');
            assertArgumentsToken('RUN command\n', 'command');
            assertArgumentsToken('RUN command\r\n', 'command');
            assertArgumentsToken('RUN command\\\r\n', 'command\\\r\n');
            var complexArgs = "set -x \t&& export GOPATH=\"$(mktemp -d)\" \t&& git clone https://github.com/BurntSushi/toml.git \"$GOPATH/src/github.com/BurntSushi/toml\" \t&& (cd \"$GOPATH/src/github.com/BurntSushi/toml\" && git checkout -q \"$TOMLV_COMMIT\") \t&& go build -v -o /usr/local/bin/tomlv github.com/BurntSushi/toml/cmd/tomlv \t&& rm -rf \"$GOPATH\"";
            assertArgumentsToken('RUN ' + complexArgs, complexArgs);
        });
        it('new line', function () {
            assertNewLines('', 0);
            assertNewLines('\n', 1);
            assertNewLines('\r\n', 1);
            assertNewLines(' \r\n', 1);
            assertNewLines(' \r\n \r\n\r\n', 3);
        });
        function assertCommentToken(contents, value) {
            read(contents)[0].should.deep.equal({ type: TokenType_1.TokenType.Comment, value: value });
        }
        function assertInstructionsToken(contents, value) {
            read(contents)[0].should.deep.equal({ type: TokenType_1.TokenType.Instruction, value: value });
        }
        function assertArgumentsToken(contents, value) {
            read(contents)[1].should.deep.equal({ type: TokenType_1.TokenType.Arguments, value: value });
        }
        function assertNewLines(contents, numberOfLines) {
            read(contents).filter(function (t) { return t.type == TokenType_1.TokenType.NewLine; }).should.have.lengthOf(numberOfLines);
        }
    });
    function read(contents) {
        createTokenizer().read(contents);
        return tokens;
    }
    function createTokenizer() {
        tokens = [];
        var tokenizer = new Tokenizer_1.Tokenizer();
        tokenizer.on('token', function (token) { return tokens.push(token); });
        return tokenizer;
    }
    var tokens;
});
//# sourceMappingURL=TokenizerSpecs.js.map