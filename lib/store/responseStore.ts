import { BehaviorSubject, Observable } from "rxjs";
import { NyxaResponseInterface } from "../core/interfaces/responseInterface";

export class NyxaResponseStore {
    private static instance: NyxaResponseStore;

    private responseSubject: BehaviorSubject<NyxaResponseInterface[]> =
        new BehaviorSubject<NyxaResponseInterface[]>([]);

    private constructor() {}

    public static getInstance(): NyxaResponseStore {
        if (!NyxaResponseStore.instance) {
            NyxaResponseStore.instance = new NyxaResponseStore();
        }
        return NyxaResponseStore.instance;
    }

    /**
     * Add a response to the store
     * @param response Response to add
     * @returns void
     */
    public addResponse(response: NyxaResponseInterface): void {
        const responses = this.responseSubject.getValue();
        if (!responses.some(r => r.id === response.id)) {
            this.responseSubject.next([...responses, response]);
        }
    }

    /**
     * Get a response by its ID
     * @param responseId Response ID
     * @returns The response object, or undefined if not found
     */
    public getResponseById(responseId: string): NyxaResponseInterface | undefined {
        return this.responseSubject.getValue().find(r => r.id === responseId);
    }

    /**
     * Clear all responses
     * @returns void
     */
    public clearResponses(): void {
        this.responseSubject.next([]);
    }

    /**
     * Get all responses
     * @returns Observable of responses
     */
    public getResponses(): Observable<NyxaResponseInterface[]> {
        return this.responseSubject.asObservable();
    }
}
