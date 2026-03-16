<script lang="ts">
	import { airports } from '$lib/Constants/Airports';
	import { onMount } from 'svelte';
	import { isIfStatement } from 'typescript';
	import Cross from '$lib/assets/cross.svg';
	import Sun from '$lib/assets/sun.svg';
	import Moon from '$lib/assets/moon.svg';
	import Refresh from '$lib/assets/refresh.svg';

	let as: HTMLAudioElement;
	let ms: HTMLAudioElement;
	let searchTerm = $state('');
	let selectOpen = $state(false);
	let selected = $state('');
	let volume = $state(0.5);
	let musicVolume = $state(0.1);
	let playing = $state(false);
	let connected = $state(0);
	let rotation = $state(0);

	$effect(() => {
		if (!selectOpen) searchTerm = '';
	});

	function setDark() {
		document.documentElement.classList.add('dark');
		localStorage.setItem('darkmode', 'true');
	}

	function setLight() {
		document.documentElement.classList.remove('dark');
		localStorage.setItem('darkmode', 'false');
	}
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

		let dark = localStorage.getItem('darkmode') === 'true';
		document.documentElement.classList.toggle('dark', dark);
	});

	setInterval(checkStates, 50);
</script>

<audio
	bind:this={ms}
	bind:volume={musicVolume}
	controls
	hidden
	src="https://boxradio-edge-00.streamafrica.net/lofi"
></audio>
<audio bind:volume bind:this={as} id="as" hidden> </audio>
<div class="flex h-lvh items-center justify-center bg-olive-100 dark:bg-zinc-900">
	<div
		class="flex aspect-square h-6/10 flex-col items-center rounded-2xl bg-olive-300 p-8 dark:bg-zinc-800"
	>
		<div class="flex w-full flex-col items-center">
			<!-- HEADER -->

			<div class="flex w-full flex-row items-center justify-center">
				<h1 class="text-4xl">LofiATC</h1>
			</div>
			<!-- /HEADER -->

			<!-- SELECTED STATION -->
			<div class="mt-3 w-9/10 rounded-xl bg-olive-400 p-3 dark:bg-zinc-700">
				<div class="flex flex-row items-center justify-between gap-0.5">
					<div class="flex flex-row gap-1">
						<p class="pl-2 font-bold">{airports.find((x) => x.code == selected)?.code ?? ''}</p>
						<button
							onclick={() => {
								rotation += 360;
								as.src.includes('s1-fmt2')
									? (as.src = as.src.replace('s1-fmt2', 's1-bos'))
									: as.src.includes('s1-bos')
										? (as.src = as.src.replace('s1-bos', 's1-fmt2'))
										: as.src;
							}}
							class="group relative rounded-full bg-olive-300 p-1 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-800 {selected
								? 'visible'
								: 'invisible'}"
						>
							<span
								class="absolute z-20 w-max -translate-x-1/2 -translate-y-7 self-center rounded-md bg-olive-200 p-1 text-xs opacity-0 transition-all group-hover:-translate-y-8.5 group-hover:opacity-100 dark:bg-zinc-600 dark:text-white"
								>Switch server</span
							>
							<!-- Arrow -->
							<div
								class="absolute aspect-square w-4 -translate-y-4.5 rotate-45 rounded-xs bg-olive-200 opacity-0 transition-all group-hover:-translate-y-6 group-hover:opacity-100 dark:bg-zinc-600"
							></div>
							<img
								class="aspect-square w-4 transition-transform duration-700 dark:invert"
								src={Refresh}
								style="transform: rotate({rotation}deg);"
								alt="logo"
							/></button
						>
					</div>
					<div class="flex flex-row items-center">
						<p
							class="indicator text-2xl text-red-500"
							class:text-red-500={connected >= 3}
							class:text-yellow-500={connected < 3 && selected != ''}
							class:text-gray-600={selected == ''}
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
					<p class="max-w-8/10 rounded-xl bg-olive-300 p-2 dark:bg-zinc-800">
						{airports.find((x) => x.code == selected)?.name ?? 'No airport selected'}
					</p>
					<button
						onclick={() => {
							selectOpen = true;
						}}
						class="rounded-xl bg-olive-300 p-1 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-800 dark:text-white"
						>Select</button
					>
				</div>
			</div>
			<!-- /SELECTED STATION -->
			<div class="m-0 flex w-max flex-col items-center justify-center p-0">
				<div class="mt-3 flex flex-row items-center justify-center gap-1">
					<button
						onclick={() => {
							volume = Math.max(volume - 0.005, 0);
							setCookie('atcVolume', volume, 1000);
						}}
						class="mb-1 text-xl transition-transform hover:scale-120 hover:cursor-pointer dark:text-white"
						>&ndash;</button
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
							volume = Math.min(volume + 0.005, 1);

							setCookie('atcVolume', volume, 1000);
						}}
						class="mb-1 text-xl transition-transform hover:scale-120 hover:cursor-pointer dark:text-white"
						>+</button
					>
				</div>
				<p>ATC: {Math.round(volume * 100)}%</p>
				<div class="flex flex-row gap-1">
					<button
						onclick={() => {
							musicVolume = Math.max(musicVolume - 0.005, 0);

							setCookie('musicVolume', musicVolume, 1000);
						}}
						class="mb-1 text-xl transition-transform hover:scale-120 hover:cursor-pointer dark:text-white"
						>&ndash;</button
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
							musicVolume = Math.min(musicVolume + 0.005, 1);

							setCookie('musicVolume', musicVolume, 1000);
						}}
						class="mb-1 text-xl transition-transform hover:scale-120 hover:cursor-pointer dark:text-white"
						>+</button
					>
				</div>
				<p>Music: {Math.round(musicVolume * 100)}%</p>
			</div>
		</div>
		<button
			onclick={togglePlaying}
			class="mt-3 mb-1 w-4/10 rounded-2xl bg-olive-400 p-2 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-700 dark:text-white"
			>{playing ? 'Pause' : 'Play'}</button
		>
		<div class="flex flex-row gap-1">
			<p class="text-xs text-olive-500 dark:text-zinc-900!">Ad playing?</p>
			<button
				onclick={() => {
					window.location.reload();
				}}
				class="text-xs text-olive-600 hover:cursor-pointer hover:underline dark:text-zinc-950!"
				>Reload the page</button
			>
		</div>
	</div>
</div>
<!-- LIGHT DARK -->
<div
	class="absolute bottom-5 left-1/2 flex h-fit w-fit -translate-x-1/2 flex-row items-center justify-center rounded-full bg-olive-300 p-2 dark:bg-zinc-700"
>
	<button
		class="rounded-full bg-olive-400 p-1 transition-transform hover:scale-105 hover:cursor-pointer dark:scale-85 dark:bg-zinc-800 dark:hover:scale-90"
		onclick={setLight}><img class="aspect-square w-10 dark:invert" src={Sun} /></button
	>
	<button
		class="scale-85 rounded-full bg-olive-400 p-1 transition-transform hover:scale-90 hover:cursor-pointer dark:scale-100 dark:bg-zinc-800 dark:hover:scale-105"
		onclick={setDark}><img class="aspect-square w-10 dark:invert" src={Moon} /></button
	>
</div>

<div
	class="absolute top-0 h-full w-full bg-olive-300 transition-opacity dark:bg-zinc-800 {selectOpen
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
				><img class="aspect-square w-10 dark:invert" src={Cross} alt="logo" /></button
			>
			<div class="flex h-full w-full items-center justify-center"><p>SELECT AIRPORT</p></div>
		</div>
	</div>
	<!-- SEARCH BAR -->
	<div class="flex flex-col items-center justify-center gap-2">
		<input
			class="w-2/10 rounded-xl bg-olive-400 p-4 text-2xl uppercase dark:bg-zinc-900 dark:text-white"
			maxlength="4"
			bind:value={searchTerm}
			type="text"
			placeholder="KATL, KJFK, EHAM..."
		/>

		{#if !searchTerm}
			<div class="flex flex-row items-center justify-between gap-2">
				<hr class="w-16" />
				<p class="">OR</p>
				<hr class="w-16" />
			</div>
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
				class="w-2/10 rounded-2xl bg-olive-400 p-4 text-2xl transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-900 dark:text-white"
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
						class="flex w-full flex-col justify-baseline rounded-2xl bg-olive-400 p-2 pl-3 transition-transform hover:scale-102 hover:cursor-pointer dark:border-white dark:bg-zinc-900"
					>
						<p class="self-start font-bold">{airport.code}</p>
						<p class="self-start">{airport.name}</p>
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
