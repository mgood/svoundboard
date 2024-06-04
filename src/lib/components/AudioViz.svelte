<script lang="ts">
	let {
		stream,
		background = 'rgb(20, 20, 20)',
		lineStyle = 'rgb(0, 240, 0)',
		lineWidth = 1
	}: {
		stream: MediaStream;
		background?: string;
		lineStyle?: string;
		lineWidth?: number;
	} = $props();

	let canvas: HTMLCanvasElement;
	const audioCtx = new AudioContext();
	const source = audioCtx.createMediaStreamSource(stream);
	const analyser = audioCtx.createAnalyser();
	analyser.fftSize = 2048;
	const dataArray = new Uint8Array(analyser.frequencyBinCount);
	source.connect(analyser);

	function paint(canvasCtx: CanvasRenderingContext2D) {
		analyser.getByteTimeDomainData(dataArray);
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
		canvasCtx.beginPath();
		let xScale = (canvas.width * 1.0) / dataArray.length;
		const yScale = canvas.height / 256.0;
		for (let i = 0; i < dataArray.length; i++) {
			let y = dataArray[i] * yScale;
			if (i === 0) {
				canvasCtx.moveTo(i * xScale, y);
			} else {
				canvasCtx.lineTo(i * xScale, y);
			}
		}
		canvasCtx.stroke();
	}

	$effect(() => {
		if (!canvas) return;
		const context = canvas.getContext('2d');
		if (!context) return;
		context.fillStyle = background;
		context.lineWidth = lineWidth;
		context.strokeStyle = lineStyle;
		let frame = requestAnimationFrame(function loop() {
			frame = requestAnimationFrame(loop);
			paint(context);
		});
		return () => {
			cancelAnimationFrame(frame);
		};
	});
</script>

<canvas bind:this={canvas}></canvas>
