<script lang="ts">
	let { data }: { data: Blob | MediaSource } = $props();
</script>

<audio src={URL.createObjectURL(data)} controls></audio>
