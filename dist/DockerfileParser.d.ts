import { Command } from './Command';
import { ArgumentsParser } from './ArgumentsParser';
import { ArgumentsParserFactory } from './ArgumentsParserFactory';
export declare class DockerfileParser {
    private commands;
    parse(contents: string, argumentsParserFactory?: ArgumentsParserFactory): Command[];
}
export declare class DefaultArgumentsParserFactory implements ArgumentsParserFactory {
    createCommentsArgsParser(): ArgumentsParser;
    createFromArgsParser(): ArgumentsParser;
    createMaintainerArgsParser(): ArgumentsParser;
    createRunArgsParser(): ArgumentsParser;
    createCmdArgsParser(): ArgumentsParser;
    createLabelArgsParser(): ArgumentsParser;
    createExposeArgsParser(): ArgumentsParser;
    createEnvArgsParser(): ArgumentsParser;
    createAddArgsParser(): ArgumentsParser;
    createCopyArgsParser(): ArgumentsParser;
    createEntryPointArgsParser(): ArgumentsParser;
    createVolumeArgsParser(): ArgumentsParser;
    createUserArgsParser(): ArgumentsParser;
    createWorkdirArgsParser(): ArgumentsParser;
    createArgArgsParser(): ArgumentsParser;
    createOnbuildArgsParser(): ArgumentsParser;
    createStopSignalArgsParser(): ArgumentsParser;
}
