export class HistoryAdapter {
    isEnabled(): boolean;
    pushState(...aArgs: any[]): void;
    replaceState(...aArgs: any[]): void;
    onPopState(fnHandler: any): void;
}
