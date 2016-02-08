import {Command} from './Command';
import {Parser} from './Parser';
import {ArgumentsParser} from './ArgumentsParser'
import {ArgumentsParserFactory} from './ArgumentsParserFactory';

export class DockerfileParser {
    private commands: Command[] = [];

    parse(contents: string, argumentsParserFactory: ArgumentsParserFactory = new DefaultArgumentsParserFactory()) {
        var parser = new Parser(contents, argumentsParserFactory);
        parser.on('command', (cmd: Command) => this.commands.push(cmd));
        parser.parse();

        return this.commands;
    }
}

export class DefaultArgumentsParserFactory implements ArgumentsParserFactory {
    createCommentsArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createFromArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createMaintainerArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createRunArgsParser(): ArgumentsParser { return new ArrayOrStringArgumentsParser(); }
    createCmdArgsParser(): ArgumentsParser { return new ArrayOrStringArgumentsParser(); }
    createLabelArgsParser(): ArgumentsParser { return new LabelKeyValueArgumentsParser(); }
    createExposeArgsParser(): ArgumentsParser { return new NumberArrayArgumentsParser(); }
    createEnvArgsParser(): ArgumentsParser { return new EnvKeyValueArgumentsParser(); }
    createAddArgsParser(): ArgumentsParser { return new SrcDestArgumentsParser(); }
    createCopyArgsParser(): ArgumentsParser { return new SrcDestArgumentsParser(); }
    createEntryPointArgsParser(): ArgumentsParser { return new ArrayOrStringArgumentsParser(); }
    createVolumeArgsParser(): ArgumentsParser { return new ArrayArgumentsParser(); }
    createUserArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createWorkdirArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createArgArgsParser(): ArgumentsParser { return new ArgKeyValueArgumentsParser(); }
    createOnbuildArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
    createStopSignalArgsParser(): ArgumentsParser { return new DefaultArgumentsParser(); }
}

class DefaultArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        return args;
    }
}

class ArrayOrStringArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            return args;
        }
    }
}

class LabelKeyValueArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        var result: Dictionary = {};

        var re = /((".*?")|([^"\s]*?))=("[\s\S]*?")/gm;
        var match: string[];
        while ((match = re.exec(args)) !== null) {
            result[match[2] || match[3]] = match[4];
        }

        return result;
    }
}

class EnvKeyValueArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        var result: Dictionary = {};

        var re = /(\w.*?)(=|\s+)(("(.*)")|(.*?)$)/gm;
        var match: string[];;
        while ((match = re.exec(args)) !== null) {
            var value: string = match[5] || match[6] || '';
            value = value.replace(/\\\s/g, ' ').replace(/\\$/, '');

            result[match[1]] = value.trim();
        }

        return result;
    }
}

class ArgKeyValueArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        var result: Dictionary = {};

        var re = /(\w.*?)(=(.*?))?\s*$/gm;
        var match: string[];;
        while ((match = re.exec(args)) !== null) {
            result[match[1]] = match[3] ? match[3].trim() : undefined;
        }

        return result;
    }
}

class NumberArrayArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        var result: number[] = [];

        var re = /(\d+)/gm;
        var match: any[];;
        while ((match = re.exec(args)) !== null) {
            result.push(parseInt(match[1], 10));
        }

        return result;
    }
}

class SrcDestArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            var match = /(.*?)\s(.*?)\s*$/.exec(args);
            return [match[1], match[2]];
        }
    }
}

class ArrayArgumentsParser implements ArgumentsParser {
    parse(args: string) {
        try {
            var parsed = JSON.parse(args);
            return Array.isArray(parsed) ? parsed : args;
        }
        catch (e) {
            return args.split(/\s+/);
        }
    }
}

interface Dictionary {
    [index: string]: any;
}
