export interface ArgumentsParser {
    parse(args: string): any;
}
export declare class NullArgumentsParser implements ArgumentsParser {
    parse(args: string): any;
}
