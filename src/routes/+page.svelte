<script lang="ts">
	import AudioViz from '$lib/components/AudioViz.svelte';
	import Recorder from '$lib/components/Recorder.svelte';
	import Play from '$lib/components/Play.svelte';
	import { browser } from '$app/environment';
	let recordings: Blob[] = $state([]);
	function recording(data: Blob) {
		recordings.push(data);
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

{#each recordings as r}
	<div>
		<Play data={r} />
	</div>
{/each}
