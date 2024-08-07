import { type Writable, writable } from 'svelte/store';

export const activeContext: Writable<string> = writable();

export const contexts: Writable<string[]> = writable([])
