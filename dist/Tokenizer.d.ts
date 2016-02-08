import { EventEmitter } from 'events';
export declare class Tokenizer extends EventEmitter {
    read(contents: string): void;
    private startToken(type);
    private append(c);
    private endToken();
    private clearToken();
    private _token;
    private forEachInput(contents, cb);
}
