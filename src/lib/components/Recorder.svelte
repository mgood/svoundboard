<script lang="ts">
	let recording = $state(false);
	let { onrecorddone, stream }: { onrecorddone: (_: Blob) => void; stream: MediaStream } = $props();

	let chunks: Blob[] = [];

	let recorder = $derived.by(() => {
		const r = new MediaRecorder(stream);
		r.addEventListener('start', () => {
			recording = true;
		});
		r.addEventListener('stop', () => {
			recording = false;
			const blob = new Blob(chunks, { type: r.mimeType });
			onrecorddone(blob);
			chunks = [];
		});
		r.addEventListener('dataavailable', (e) => {
			chunks.push(e.data);
		});
		return r;
	});
</script>

<button onclick={() => recorder.start()} disabled={recording}> Record </button>
<button onclick={() => recorder.stop()} disabled={!recording}> Stop </button>
