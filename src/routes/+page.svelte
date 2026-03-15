<script lang="ts">
	import { airports } from '$lib/Constants/Airports';
	import { onMount } from 'svelte';
	import { isIfStatement } from 'typescript';
	import Cross from '$lib/assets/cross.svg';

	let as: HTMLAudioElement;
	let ms: HTMLAudioElement;
	let searchTerm = $state('');
	let selectOpen = $state(false);
	let selected = $state('');
	let volume = $state(0.5);
	let musicVolume = $state(0.1);
	let playing = $state(false);
	let connected = $state(0);

	let crossThing = $state(Cross);
	const CrossIcon = $derived(crossThing);

	$effect(() => {
		if (!selectOpen) searchTerm = '';
	});

	function checkStates() {
		connected = as?.readyState;
		playing = !as?.paused || !ms?.paused;
	}
	function setCookie(name: string, value: any, days: number) {
		var expires = '';
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + (value || '') + expires + '; path=/';
	}
	function getCookie(name: string) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
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
	onMount(() => {
		let mv = getCookie('musicVolume');
		let av = getCookie('atcVolume');

		if (mv != null) musicVolume = Number.parseFloat(mv);
		if (av != null) volume = Number.parseFloat(av);
		console.log(mv, av);
	});

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
	<div class="flex aspect-square h-6/10 flex-col items-center rounded-2xl bg-olive-300 p-8">
		<div class="flex w-full flex-col items-center">
			<!-- HEADER -->

			<div class="flex w-full flex-row items-center justify-center">
				<h1 class="text-4xl">LofiATC</h1>
			</div>
			<!-- /HEADER -->

			<!-- SELECTED STATION -->
			<div class="mt-3 w-9/10 rounded-xl bg-olive-400 p-3">
				<div class="flex flex-row items-center justify-between gap-0.5">
					<p class="pl-2">{airports.find((x) => x.code == selected)?.code ?? ''}</p>
					<div class="flex flex-row items-center">
						<p
							class="text-2xl text-red-500"
							class:text-red-500={connected >= 3}
							class:text-yellow-500={connected < 3 && selected != ''}
							class:text-gray-500={selected == ''}
							class:animate-pulse={connected >= 3}
						>
							•
						</p>
						<p class="">
							{connected < 3 && selected == ''
								? 'No connection'
								: connected < 3
									? 'Connecting'
									: 'LIVE'}
						</p>
					</div>
				</div>
				<div class="flex flex-row items-center justify-between">
					<p class="max-w-8/10 rounded-xl bg-olive-300 p-2">
						{airports.find((x) => x.code == selected)?.name ?? 'No airport selected'}
					</p>
					<button
						onclick={() => {
							selectOpen = true;
						}}
						class="rounded-xl bg-olive-300 p-1 transition-transform hover:scale-105 hover:cursor-pointer"
						>Select</button
					>
				</div>
			</div>
			<!-- /SELECTED STATION -->

			<div class="my-4 grid grid-cols-6 flex-wrap gap-2"></div>
			<div class="flex flex-row gap-1">
				<button
					onclick={() => {
						volume -= 0.005;
						setCookie('atcVolume', volume, 1000);
					}}
					class="hover:cursor-pointer">-</button
				>
				<input
					onchange={() => {
						setCookie('atcVolume', volume, 1000);
					}}
					bind:value={volume}
					type="range"
					min="0"
					max="1"
					step="0.005"
				/>
				<button
					onclick={() => {
						volume += 0.005;
						setCookie('atcVolume', volume, 1000);
					}}
					class="hover:cursor-pointer">+</button
				>
			</div>
			<p>ATC:{Math.round(volume * 100)}%</p>
			<div class="flex flex-row gap-1">
				<button
					onclick={() => {
						musicVolume -= 0.005;
						setCookie('musicVolume', musicVolume, 1000);
					}}
					class="hover:cursor-pointer">-</button
				>
				<input
					onchange={() => {
						setCookie('musicVolume', musicVolume, 1000);
					}}
					bind:value={musicVolume}
					type="range"
					min="0"
					max="1"
					step="0.005"
				/>
				<button
					onclick={() => {
						musicVolume += 0.005;
						setCookie('musicVolume', musicVolume, 1000);
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
		<div class="flex flex-row gap-1">
			<p class="text-xs text-olive-500">Ad playing?</p>
			<button
				onclick={() => {
					window.location.reload();
				}}
				class="text-xs text-olive-600 hover:cursor-pointer hover:underline">Reload the page</button
			>
		</div>
	</div>
</div>

<div
	class="absolute top-0 h-full w-full bg-olive-300 transition-opacity {selectOpen
		? 'pointer-events-auto opacity-100'
		: 'pointer-events-none opacity-0'}"
>
	<!-- TOP BAR -->
	<div class="relative h-1/10 w-full text-3xl">
		<div class="absolute flex h-full w-full items-center justify-end p-3">
			<button
				onclick={() => {
					selectOpen = false;
				}}
				class="absolute flex transition-transform duration-700 hover:rotate-360 hover:cursor-pointer"
				><img class="aspect-square w-10" src={Cross} alt="logo" /></button
			>
			<div class="flex h-full w-full items-center justify-center"><p>SELECT AIRPORT</p></div>
		</div>
	</div>
	<!-- SEARCH BAR -->
	<div class="flex flex-col items-center justify-center gap-2">
		<input
			class="h-20 w-2/10 rounded-xl bg-olive-400 px-1 text-2xl uppercase"
			maxlength="4"
			bind:value={searchTerm}
			type="text"
			placeholder="KATL, KJFK, ETC."
		/>

		{#if !searchTerm}
			<p>or</p>
			<button
				onclick={() => {
					let airport = airports[Math.floor(Math.random() * airports.length)];
					if (as.paused) {
						as.src = airport.uri;
						selected = airport.code;
					} else {
						as.src = airport.uri;
						selected = airport.code;
						as.play();
					}
					selectOpen = false;
				}}
				class="h-20 w-2/10 rounded-2xl bg-olive-400 px-1 text-2xl transition-transform hover:scale-105 hover:cursor-pointer"
				>Random airport</button
			>
		{:else}
			<div class="flex h-3/10 w-3/10 flex-col gap-1.5 p-4">
				{#each airports.filter((x) => x.code.includes(searchTerm.toUpperCase())) as airport}
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
							selectOpen = false;
						}}
						class:border-2={selected == airport?.code}
						class="flex w-full flex-col justify-baseline rounded-2xl bg-olive-400 p-2 transition-transform hover:scale-105 hover:cursor-pointer"
					>
						<p class="self-start">{airport.code}</p>
						<p class="self-start">{airport.name}</p>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
