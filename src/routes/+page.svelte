<script lang="ts">
	import { airports } from '$lib/Constants/Airports';
	import { onMount } from 'svelte';

	let as: HTMLAudioElement;
	let ms: HTMLAudioElement;
	let selected = $state('');
	let volume = $state(0.5);
	let musicVolume = $state(0.1);
	let playing = $state(false);
	let connected = $state(0);
	function checkStates() {
		connected = as?.readyState;
		playing = !as?.paused || !ms?.paused;
	}
	function togglePlaying() {
		if (as.paused) {
			as.play();
			ms.play();
			playing = true;
		} else {
			as.pause();
			ms.pause();
			playing = false;
		}
	}
	let player;
	onMount(() => {});

	setInterval(checkStates, 50);
</script>

<audio
	bind:this={ms}
	bind:volume={musicVolume}
	controls
	hidden
	src="https://live.hunter.fm/lofi_high"
></audio>
<audio bind:volume bind:this={as} id="as" hidden> </audio>
<div class="flex h-lvh items-center justify-center bg-olive-100">
	<div
		class="flex aspect-square flex-col items-center justify-between rounded-2xl bg-olive-300 p-4"
	>
		<div class="flex flex-col items-center">
			<div class="flex w-full flex-row items-center justify-between">
				<div class="flex flex-row items-center gap-0.5 text-transparent select-none">
					<p class="text-3xl text-transparent">•</p>
					<p class="text-xl">
						{connected < 3 && selected == ''
							? 'No connection'
							: connected < 3
								? 'Connecting'
								: 'LIVE'}
					</p>
				</div>
				<h1 class="text-4xl">LofiATC</h1>
				<div class="flex flex-row items-center gap-0.5">
					<p
						class="text-3xl text-red-500"
						class:text-red-500={connected >= 3}
						class:text-yellow-500={connected < 3 && selected != ''}
						class:text-gray-500={selected == ''}
						class:animate-pulse={connected >= 3}
					>
						•
					</p>
					<p class="text-xl">
						{connected < 3 && selected == ''
							? 'No connection'
							: connected < 3
								? 'Connecting'
								: 'LIVE'}
					</p>
				</div>
			</div>

			<div class="my-4 grid grid-cols-6 flex-wrap gap-2">
				{#each airports as airport}
					<button
						onclick={() => {
							if (as.paused) {
								as.src = airport.uri;
								selected = airport.code;
							} else {
								as.src = airport.uri;
								selected = airport.code;
								as.play();
							}
						}}
						class:border-2={selected == airport?.code}
						class="aspect-square rounded-2xl bg-olive-400 p-2 transition-transform hover:scale-105 hover:cursor-pointer"
						>{airport.code}</button
					>
				{/each}
			</div>
			<div class="flex flex-row gap-1">
				<button
					onclick={() => {
						volume -= 0.005;
					}}
					class="hover:cursor-pointer">-</button
				>
				<input bind:value={volume} type="range" min="0" max="1" step="0.005" />
				<button
					onclick={() => {
						volume += 0.005;
					}}
					class="hover:cursor-pointer">+</button
				>
			</div>
			<p>ATC:{Math.round(volume * 100)}%</p>
			<div class="flex flex-row gap-1">
				<button
					onclick={() => {
						musicVolume -= 0.005;
					}}
					class="hover:cursor-pointer">-</button
				>
				<input bind:value={musicVolume} type="range" min="0" max="1" step="0.005" />
				<button
					onclick={() => {
						musicVolume += 0.005;
					}}
					class="hover:cursor-pointer">+</button
				>
			</div>
			<p>Music:{Math.round(musicVolume * 100)}%</p>
		</div>
		<button
			onclick={togglePlaying}
			class="w-4/10 rounded-2xl bg-olive-400 p-2 transition-transform hover:scale-105 hover:cursor-pointer"
			>{playing ? 'Pause' : 'Play'}</button
		>
	</div>
</div>
