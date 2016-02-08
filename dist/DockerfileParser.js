var Parser_1 = require('./Parser');
var DockerfileParser = (function () {
    function DockerfileParser() {
        this.commands = [];
    }
    DockerfileParser.prototype.parse = function (contents, argumentsParserFactory) {
        var _this = this;
        if (argumentsParserFactory === void 0) { argumentsParserFactory = new DefaultArgumentsParserFactory(); }
        var parser = new Parser_1.Parser(contents, argumentsParserFactory);
        parser.on('command', function (cmd) { return _this.commands.push(cmd); });
        parser.parse();
        return this.commands;
    };
    return DockerfileParser;
})();
exports.DockerfileParser = DockerfileParser;
var DefaultArgumentsParserFactory = (function () {
    function DefaultArgumentsParserFactory() {
    }
    DefaultArgumentsParserFactory.prototype.createCommentsArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createFromArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createMaintainerArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createRunArgsParser = function () { return new ArrayOrStringArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createCmdArgsParser = function () { return new ArrayOrStringArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createLabelArgsParser = function () { return new LabelKeyValueArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createExposeArgsParser = function () { return new NumberArrayArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createEnvArgsParser = function () { return new EnvKeyValueArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createAddArgsParser = function () { return new SrcDestArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createCopyArgsParser = function () { return new SrcDestArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createEntryPointArgsParser = function () { return new ArrayOrStringArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createVolumeArgsParser = function () { return new ArrayArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createUserArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createWorkdirArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createArgArgsParser = function () { return new ArgKeyValueArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createOnbuildArgsParser = function () { return new DefaultArgumentsParser(); };
    DefaultArgumentsParserFactory.prototype.createStopSignalArgsParser = function () { return new DefaultArgumentsParser(); };
    return DefaultArgumentsParserFactory;
})();
exports.DefaultArgumentsParserFactory = DefaultArgumentsParserFactory;
var DefaultArgumentsParser = (function () {
    function DefaultArgumentsParser() {
    }
    DefaultArgumentsParser.prototype.parse = function (args) {
        return args;
    };
    return DefaultArgumentsParser;
})();
var ArrayOrStringArgumentsParser = (function () {
    function ArrayOrStringArgumentsParser() {
    }
    ArrayOrStringArgumentsParser.prototype.parse = function (args) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            return args;
        }
    };
    return ArrayOrStringArgumentsParser;
})();
var LabelKeyValueArgumentsParser = (function () {
    function LabelKeyValueArgumentsParser() {
    }
    LabelKeyValueArgumentsParser.prototype.parse = function (args) {
        var result = {};
        var re = /((".*?")|([^"\s]*?))=("[\s\S]*?")/gm;
        var match;
        while ((match = re.exec(args)) !== null) {
            result[match[2] || match[3]] = match[4];
        }
        return result;
    };
    return LabelKeyValueArgumentsParser;
})();
var EnvKeyValueArgumentsParser = (function () {
    function EnvKeyValueArgumentsParser() {
    }
    EnvKeyValueArgumentsParser.prototype.parse = function (args) {
        var result = {};
        var re = /(\w.*?)(=|\s+)(("(.*)")|(.*?)$)/gm;
        var match;
        ;
        while ((match = re.exec(args)) !== null) {
            var value = match[5] || match[6] || '';
            value = value.replace(/\\\s/g, ' ').replace(/\\$/, '');
            result[match[1]] = value.trim();
        }
        return result;
    };
    return EnvKeyValueArgumentsParser;
})();
var ArgKeyValueArgumentsParser = (function () {
    function ArgKeyValueArgumentsParser() {
    }
    ArgKeyValueArgumentsParser.prototype.parse = function (args) {
        var result = {};
        var re = /(\w.*?)(=(.*?))?\s*$/gm;
        var match;
        ;
        while ((match = re.exec(args)) !== null) {
            result[match[1]] = match[3] ? match[3].trim() : undefined;
        }
        return result;
    };
    return ArgKeyValueArgumentsParser;
})();
var NumberArrayArgumentsParser = (function () {
    function NumberArrayArgumentsParser() {
    }
    NumberArrayArgumentsParser.prototype.parse = function (args) {
        var result = [];
        var re = /(\d+)/gm;
        var match;
        ;
        while ((match = re.exec(args)) !== null) {
            result.push(parseInt(match[1], 10));
        }
        return result;
    };
    return NumberArrayArgumentsParser;
})();
var SrcDestArgumentsParser = (function () {
    function SrcDestArgumentsParser() {
    }
    SrcDestArgumentsParser.prototype.parse = function (args) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            var match = /(.*?)\s(.*?)\s*$/.exec(args);
            return [match[1], match[2]];
        }
    };
    return SrcDestArgumentsParser;
})();
var ArrayArgumentsParser = (function () {
    function ArrayArgumentsParser() {
    }
    ArrayArgumentsParser.prototype.parse = function (args) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            return args.split(/\s+/);
        }
    };
    return ArrayArgumentsParser;
})();
//# sourceMappingURL=DockerfileParser.js.map