<script lang="ts">
	import { db } from '$lib/db';
	import { liveQuery } from 'dexie';
	import AudioViz from '$lib/components/AudioViz.svelte';
	import Recorder from '$lib/components/Recorder.svelte';
	import Play from '$lib/components/Play.svelte';
	import { browser } from '$app/environment';
	let recordings = liveQuery(() => db.clips.toArray());
	function recording(data: Blob) {
		db.clips.add({
			name: '',
			data
		});
	}
	async function rename(id: number, name: string) {
		await db.clips.update(id, { name });
	}
	let stream = $state(new Promise<MediaStream>(() => {}));
	if (browser) {
		stream = window.navigator.mediaDevices.getUserMedia({ audio: true });
	}
</script>

<div>
	{#await stream then s}
		<AudioViz stream={s} />
		<Recorder onrecorddone={recording} stream={s} />
	{/await}
</div>

{#if $recordings}
	{#each $recordings as r}
		<div>
			<input
				type="text"
				value={r.name}
				onchange={(e) => rename(r.id, e.currentTarget.value)}
				placeholder="Untitled clip #{r.id}"
			/>
			<Play data={r.data} />
			<button onclick={() => db.clips.delete(r.id)}>X</button>
		</div>
	{/each}
{/if}
