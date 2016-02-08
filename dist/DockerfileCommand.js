var DockerfileCommand = (function () {
    function DockerfileCommand() {
    }
    DockerfileCommand.FROM = "FROM";
    DockerfileCommand.MAINTAINER = "MAINTAINER";
    DockerfileCommand.RUN = "RUN";
    DockerfileCommand.CMD = "CMD";
    DockerfileCommand.LABEL = "LABEL";
    DockerfileCommand.EXPOSE = "EXPOSE";
    DockerfileCommand.ENV = "ENV";
    DockerfileCommand.ADD = "ADD";
    DockerfileCommand.COPY = "COPY";
    DockerfileCommand.ENTRYPOINT = "ENTRYPOINT";
    DockerfileCommand.VOLUME = "VOLUME";
    DockerfileCommand.USER = "USER";
    DockerfileCommand.WORKDIR = "WORKDIR";
    DockerfileCommand.ARG = "ARG";
    DockerfileCommand.ONBUILD = "ONBUILD";
    DockerfileCommand.STOPSIGNAL = "STOPSIGNAL";
    DockerfileCommand.COMMENT = "COMMENT";
    return DockerfileCommand;
})();
exports.DockerfileCommand = DockerfileCommand;
//# sourceMappingURL=DockerfileCommand.js.map