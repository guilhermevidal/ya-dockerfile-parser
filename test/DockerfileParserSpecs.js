/// <reference path="../typings/main" />
var chai = require('chai');
chai.should();
var expect = chai.expect;
var DockerfileCommand_1 = require('../dist/DockerfileCommand');
var DockerfileParser_1 = require('../dist/DockerfileParser');
describe('DockerfileParser', function () {
    describe('parse', function () {
        it('should parse COMMENT', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.COMMENT, '# Hello', 'Hello');
        });
        it('should parse FROM', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.FROM, 'FROM ubuntu', 'ubuntu');
        });
        it('should parse MAINTAINER', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.MAINTAINER, 'MAINTAINER name', 'name');
        });
        it('should parse RUN', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.RUN, 'RUN /bin/sh -c', '/bin/sh -c');
            assertCommand(DockerfileCommand_1.DockerfileCommand.RUN, "RUN /bin/bash -c 'source $HOME/.bashrc ;\\\necho $HOME'", "/bin/bash -c 'source $HOME/.bashrc ;\\\necho $HOME'");
            assertCommand(DockerfileCommand_1.DockerfileCommand.RUN, 'RUN ["/bin/bash", "-c", "echo hello"]', ["/bin/bash", "-c", "echo hello"]);
        });
        it('should parse CMD', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.CMD, 'CMD echo "This is a test." | wc -', 'echo "This is a test." | wc -');
            assertCommand(DockerfileCommand_1.DockerfileCommand.CMD, 'CMD [ "sh", "-c", "echo", "$HOME" ]', ["sh", "-c", "echo", "$HOME"]);
        });
        it('should parse LABEL', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.LABEL, 'LABEL "com.example.vendor"="ACME Incorporated"', { '"com.example.vendor"': '"ACME Incorporated"' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.LABEL, 'LABEL com.example.label-with-value="foo"', { 'com.example.label-with-value': '"foo"' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.LABEL, 'LABEL description="This text illustrates \\\nthat label-values can span multiple lines."', { 'description': '"This text illustrates \\\nthat label-values can span multiple lines."' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.LABEL, 'LABEL multi.label1="value1" multi.label2="value2" other="value3"', { 'multi.label1': '"value1"', 'multi.label2': '"value2"', 'other': '"value3"' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.LABEL, 'LABEL multi.label1="value1" \\\n\tmulti.label2="value2" \\\n\tother="value3"', { 'multi.label1': '"value1"', 'multi.label2': '"value2"', 'other': '"value3"' });
        });
        it('should parse EXPOSE', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.EXPOSE, 'EXPOSE 8080', [8080]);
            assertCommand(DockerfileCommand_1.DockerfileCommand.EXPOSE, 'EXPOSE 8080 8081 8082', [8080, 8081, 8082]);
        });
        it('should parse ENV', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.ENV, 'ENV myName John Doe', { 'myName': 'John Doe' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.ENV, 'ENV myName="John Doe" myDog=Rex\\ The\\ Dog \\\nmyCat=fluffy', { 'myName': 'John Doe', 'myDog': 'Rex The Dog', 'myCat': 'fluffy' });
        });
        it('should parse ADD', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.ADD, 'ADD hom?.txt /mydir/', ["hom?.txt", "/mydir/"]);
            assertCommand(DockerfileCommand_1.DockerfileCommand.ADD, 'ADD ["h o m e.txt", "/my dir/"]', ["h o m e.txt", "/my dir/"]);
        });
        it('should parse COPY', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.COPY, 'COPY hom?.txt /mydir/', ["hom?.txt", "/mydir/"]);
            assertCommand(DockerfileCommand_1.DockerfileCommand.COPY, 'COPY ["h o m e.txt", "/my dir/"]', ["h o m e.txt", "/my dir/"]);
        });
        it('should parse ENTRYPOINT', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.ENTRYPOINT, 'ENTRYPOINT echo "This is a test." | wc -', 'echo "This is a test." | wc -');
            assertCommand(DockerfileCommand_1.DockerfileCommand.ENTRYPOINT, 'ENTRYPOINT [ "sh", "-c", "echo", "$HOME" ]', ["sh", "-c", "echo", "$HOME"]);
        });
        it('should parse VOLUME', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.VOLUME, 'VOLUME ["/var/log/", "/var/db/"]', ["/var/log/", "/var/db/"]);
            assertCommand(DockerfileCommand_1.DockerfileCommand.VOLUME, 'VOLUME /var/log/ /var/db/', ["/var/log/", "/var/db/"]);
        });
        it('should parse USER', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.USER, 'USER daemon', 'daemon');
        });
        it('should parse WORKDIR', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.WORKDIR, 'WORKDIR /path/to/workdir', '/path/to/workdir');
        });
        it('should parse ARG', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.ARG, 'ARG user1', { 'user1': undefined });
            assertCommand(DockerfileCommand_1.DockerfileCommand.ARG, 'ARG buildno', { 'buildno': undefined });
            assertCommand(DockerfileCommand_1.DockerfileCommand.ARG, 'ARG user1=someuser', { 'user1': 'someuser' });
            assertCommand(DockerfileCommand_1.DockerfileCommand.ARG, 'ARG buildno=1', { 'buildno': '1' });
        });
        it('should parse ONBUILD', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.ONBUILD, 'ONBUILD RUN /usr/local/bin/python-build --dir /app/src', 'RUN /usr/local/bin/python-build --dir /app/src');
        });
        it('should parse STOPSIGNAL', function () {
            assertCommand(DockerfileCommand_1.DockerfileCommand.STOPSIGNAL, 'STOPSIGNAL 9', '9');
        });
        function assertCommand(command, contents, args) {
            parse(contents)[0].should.be.deep.equal({ name: command, lineno: 1, args: args });
        }
        function parse(contents) {
            return new DockerfileParser_1.DockerfileParser().parse(contents);
        }
    });
});
//# sourceMappingURL=DockerfileParserSpecs.js.map