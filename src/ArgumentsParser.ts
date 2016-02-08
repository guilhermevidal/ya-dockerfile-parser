export interface ArgumentsParser {
    parse(args: string): any;
}

export class NullArgumentsParser implements ArgumentsParser {
    parse(args: string): any {
        return undefined;
    }
}
