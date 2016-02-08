/// <reference path="../typings/main" />
import * as chai from 'chai';

chai.should();
let expect = chai.expect;

import {Token} from '../dist/Token';
import {TokenType} from '../dist/TokenType';
import {Tokenizer} from '../dist/Tokenizer';

describe('Tokenizer', () => {

    describe('Should emit when token found', () => {
        it('comments', () => {
            assertCommentToken('#', '');
            assertCommentToken('# Hello', 'Hello');
            assertCommentToken('# Hello\n', 'Hello');
            assertCommentToken('# Hello\r\n', 'Hello');
            assertCommentToken('# Hello/\r\n', 'Hello/');
            assertCommentToken('# Hello World/\r\n', 'Hello World/');
        })

        it('instructions', () => {
            assertInstructionsToken('RUN', 'RUN');
            assertInstructionsToken('RUN\n', 'RUN');
            assertInstructionsToken('RUN\r\n', 'RUN');
            assertInstructionsToken('RUN \r\n', 'RUN');
        });

        it('arguments', () => {
            assertArgumentsToken('RUN command', 'command');
            assertArgumentsToken('RUN command\n', 'command');
            assertArgumentsToken('RUN command\r\n', 'command');
            assertArgumentsToken('RUN command\\\r\n', 'command\\\r\n');

            var complexArgs = `set -x \
	&& export GOPATH="$(mktemp -d)" \
	&& git clone https://github.com/BurntSushi/toml.git "$GOPATH/src/github.com/BurntSushi/toml" \
	&& (cd "$GOPATH/src/github.com/BurntSushi/toml" && git checkout -q "$TOMLV_COMMIT") \
	&& go build -v -o /usr/local/bin/tomlv github.com/BurntSushi/toml/cmd/tomlv \
	&& rm -rf "$GOPATH"`;
            assertArgumentsToken('RUN ' + complexArgs, complexArgs);
        });

        it('new line', () => {
            assertNewLines('', 0);
            assertNewLines('\n', 1);
            assertNewLines('\r\n', 1);
            assertNewLines(' \r\n', 1);
            assertNewLines(' \r\n \r\n\r\n', 3);
        });

        function assertCommentToken(contents: string, value: string) {
            read(contents)[0].should.deep.equal({ type: TokenType.Comment, value: value });
        }

        function assertInstructionsToken(contents: string, value: string) {
            read(contents)[0].should.deep.equal({ type: TokenType.Instruction, value: value });
        }

        function assertArgumentsToken(contents: string, value: string) {
            read(contents)[1].should.deep.equal({ type: TokenType.Arguments, value: value });
        }

        function assertNewLines(contents: string, numberOfLines: number) {
            read(contents).filter(t => t.type == TokenType.NewLine).should.have.lengthOf(numberOfLines);
        }
    });

    function read(contents: string) {
        createTokenizer().read(contents);
        return tokens;
    }

    function createTokenizer() {
        tokens = [];
        var tokenizer = new Tokenizer();
        tokenizer.on('token', (token: Token) => tokens.push(token));
        return tokenizer;
    }

    var tokens: Token[];
});
