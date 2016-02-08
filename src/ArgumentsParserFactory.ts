import {ArgumentsParser} from './ArgumentsParser'

export interface ArgumentsParserFactory {
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
