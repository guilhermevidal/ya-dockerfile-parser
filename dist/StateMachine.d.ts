import { Input } from './Input';
import { State } from './State';
export declare class StateMachine {
    private current;
    next(input: Input): State;
    private machine;
}
