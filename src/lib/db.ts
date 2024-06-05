import Dexie, { type EntityTable } from 'dexie';

interface Clip {
	id: number;
	name: string;
	data: Blob;
}

const db = new Dexie('Clips') as Dexie & {
	clips: EntityTable<
		Clip,
		'id' // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	clips: '++id, name' // primary key "id" (for the runtime!)
});

export type { Clip };
export { db };
