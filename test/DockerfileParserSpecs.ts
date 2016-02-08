/// <reference path="../typings/main" />
import * as chai from 'chai';

chai.should();
let expect = chai.expect;

import {DockerfileCommand} from '../dist/DockerfileCommand'
import {DockerfileParser} from '../dist/DockerfileParser'

describe('DockerfileParser', () => {

    describe('parse', () => {
        it('should parse COMMENT', () => {
            assertCommand(DockerfileCommand.COMMENT, '# Hello', 'Hello');
        });

        it('should parse FROM', () => {
            assertCommand(DockerfileCommand.FROM, 'FROM ubuntu', 'ubuntu');
        });

        it('should parse MAINTAINER', () => {
            assertCommand(DockerfileCommand.MAINTAINER, 'MAINTAINER name', 'name');
        });

        it('should parse RUN', () => {
            assertCommand(DockerfileCommand.RUN, 'RUN /bin/sh -c', '/bin/sh -c');
            assertCommand(DockerfileCommand.RUN, "RUN /bin/bash -c 'source $HOME/.bashrc ;\\\necho $HOME'", "/bin/bash -c 'source $HOME/.bashrc ;\\\necho $HOME'");
            assertCommand(DockerfileCommand.RUN, 'RUN ["/bin/bash", "-c", "echo hello"]', ["/bin/bash", "-c", "echo hello"]);
        });

        it('should parse CMD', () => {
            assertCommand(DockerfileCommand.CMD, 'CMD echo "This is a test." | wc -', 'echo "This is a test." | wc -');
            assertCommand(DockerfileCommand.CMD, 'CMD [ "sh", "-c", "echo", "$HOME" ]', ["sh", "-c", "echo", "$HOME"]);
        });

        it('should parse LABEL', () => {
            assertCommand(DockerfileCommand.LABEL, 'LABEL "com.example.vendor"="ACME Incorporated"', { '"com.example.vendor"': '"ACME Incorporated"' });
            assertCommand(DockerfileCommand.LABEL, 'LABEL com.example.label-with-value="foo"', { 'com.example.label-with-value': '"foo"' });
            assertCommand(DockerfileCommand.LABEL, 'LABEL description="This text illustrates \\\nthat label-values can span multiple lines."', { 'description': '"This text illustrates \\\nthat label-values can span multiple lines."' });
            assertCommand(DockerfileCommand.LABEL, 'LABEL multi.label1="value1" multi.label2="value2" other="value3"', { 'multi.label1': '"value1"', 'multi.label2': '"value2"', 'other': '"value3"' });
            assertCommand(DockerfileCommand.LABEL, 'LABEL multi.label1="value1" \\\n\tmulti.label2="value2" \\\n\tother="value3"', { 'multi.label1': '"value1"', 'multi.label2': '"value2"', 'other': '"value3"' });
        });

        it('should parse EXPOSE', () => {
            assertCommand(DockerfileCommand.EXPOSE, 'EXPOSE 8080', [8080]);
            assertCommand(DockerfileCommand.EXPOSE, 'EXPOSE 8080 8081 8082', [8080, 8081, 8082]);
        });

        it('should parse ENV', () => {
            assertCommand(DockerfileCommand.ENV, 'ENV myName John Doe', { 'myName': 'John Doe' });
            assertCommand(DockerfileCommand.ENV, 'ENV myName="John Doe" myDog=Rex\\ The\\ Dog \\\nmyCat=fluffy', { 'myName': 'John Doe', 'myDog': 'Rex The Dog', 'myCat': 'fluffy' });
        });

        it('should parse ADD', () => {
            assertCommand(DockerfileCommand.ADD, 'ADD hom?.txt /mydir/', ["hom?.txt", "/mydir/"]);
            assertCommand(DockerfileCommand.ADD, 'ADD ["h o m e.txt", "/my dir/"]', ["h o m e.txt", "/my dir/"]);
        });

        it('should parse COPY', () => {
            assertCommand(DockerfileCommand.COPY, 'COPY hom?.txt /mydir/', ["hom?.txt", "/mydir/"]);
            assertCommand(DockerfileCommand.COPY, 'COPY ["h o m e.txt", "/my dir/"]', ["h o m e.txt", "/my dir/"]);
        });

        it('should parse ENTRYPOINT', () => {
            assertCommand(DockerfileCommand.ENTRYPOINT, 'ENTRYPOINT echo "This is a test." | wc -', 'echo "This is a test." | wc -');
            assertCommand(DockerfileCommand.ENTRYPOINT, 'ENTRYPOINT [ "sh", "-c", "echo", "$HOME" ]', ["sh", "-c", "echo", "$HOME"]);
        });

        it('should parse VOLUME', () => {
            assertCommand(DockerfileCommand.VOLUME, 'VOLUME ["/var/log/", "/var/db/"]', ["/var/log/", "/var/db/"]);
            assertCommand(DockerfileCommand.VOLUME, 'VOLUME /var/log/ /var/db/', ["/var/log/", "/var/db/"]);
        });

        it('should parse USER', () => {
            assertCommand(DockerfileCommand.USER, 'USER daemon', 'daemon');
        });

        it('should parse WORKDIR', () => {
            assertCommand(DockerfileCommand.WORKDIR, 'WORKDIR /path/to/workdir', '/path/to/workdir');
        });

        it('should parse ARG', () => {
            assertCommand(DockerfileCommand.ARG, 'ARG user1', { 'user1': undefined });
            assertCommand(DockerfileCommand.ARG, 'ARG buildno', { 'buildno': undefined });
            assertCommand(DockerfileCommand.ARG, 'ARG user1=someuser', { 'user1': 'someuser' });
            assertCommand(DockerfileCommand.ARG, 'ARG buildno=1', { 'buildno': '1' });
        });

        it('should parse ONBUILD', () => {
            assertCommand(DockerfileCommand.ONBUILD, 'ONBUILD RUN /usr/local/bin/python-build --dir /app/src', 'RUN /usr/local/bin/python-build --dir /app/src');
        });

        it('should parse STOPSIGNAL', () => {
            assertCommand(DockerfileCommand.STOPSIGNAL, 'STOPSIGNAL 9', '9');
        });

        function assertCommand(command: string, contents: string, args: any) {
            parse(contents)[0].should.be.deep.equal({ name: command, lineno: 1, args: args });
        }

        function parse(contents: string) {
            return new DockerfileParser().parse(contents);
        }
    });

});
