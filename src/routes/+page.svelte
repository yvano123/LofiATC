<script lang="ts">
	import { airports } from '$lib/Constants/Airports';
	import { onMount } from 'svelte';
	import { isIfStatement } from 'typescript';
	import Cross from '$lib/assets/cross.svg';
	import Sun from '$lib/assets/sun.svg';
	import Moon from '$lib/assets/moon.svg';
	import Refresh from '$lib/assets/refresh.svg';
	import Arrow from '$lib/assets/arrow.svg';
	import { radioStations } from '$lib/Constants/RadioStations';

	let as: HTMLAudioElement;
	let ms: HTMLAudioElement;
	let searchTerm = $state('');
	let selectOpen = $state(false);
	let selected = $state('KATL');
	let volume = $state(0.5);
	let musicVolume = $state(0.5);
	let playing = $state(false);
	let connected = $state(0);
	let mConnected = $state(0);
	let rotation = $state(0);
	let searchMode = $state(0);
	let error = $state(0);
	let selectedRadio = $state('');
	let radioSelectOpen = $state(false);

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
		mConnected = ms?.readyState;
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
	onMount(() => {
		let mv = getCookie('musicVolume');
		let av = getCookie('atcVolume');
		let stat = getCookie('station');

		selectedRadio = stat ?? radioStations[0].name;

		ms.src = radioStations.find((x) => x.name == selectedRadio)!.uri;

		if (mv != null) musicVolume = Number.parseFloat(mv);
		if (av != null) volume = Number.parseFloat(av);

		let dark = localStorage.getItem('darkmode') === 'true';
		document.documentElement.classList.toggle('dark', dark);

		if (selected) {
			as.src = airports.find((x) => x.code == selected)?.uri ?? '';
		}
		document.addEventListener('click', (e) => {
			const select = document.querySelector('.selectradio');
			if (!select?.contains(e.target as Node)) radioSelectOpen = false;
		});
	});

	setInterval(checkStates, 50);

	function switchServer() {
		rotation += 360;
		as.src.includes('s1-fmt2')
			? (as.src = as.src.replace('s1-fmt2', 's1-bos'))
			: as.src.includes('s1-bos')
				? (as.src = as.src.replace('s1-bos', 's1-fmt2'))
				: as.src;
	}
</script>

<audio bind:this={ms} bind:volume={musicVolume} controls hidden></audio>
<audio
	bind:volume
	oncanplay={() => {
		error = 0;
	}}
	onerror={() => {
		error == 0 ? (error = 1) : (error = 2);
		if (error < 2) switchServer();
	}}
	bind:this={as}
	id="as"
	hidden
>
</audio>
<div class="flex h-lvh items-center justify-center bg-olive-100 dark:bg-zinc-900">
	<div
		class="flex w-9/10 max-w-100 flex-col items-center rounded-2xl bg-olive-300 p-2 py-4 sm:w-7/10 md:w-6/10 lg:w-6/20 lg:min-w-100 lg:p-8 dark:bg-zinc-800"
	>
		<div class="flex w-full flex-col items-center">
			<!-- HEADER -->

			<div class="flex w-full flex-row items-center justify-center">
				<h1 class="text-4xl">Lofi ATC</h1>
			</div>
			<!-- /HEADER -->

			<!-- SELECTED STATION -->
			<div class="mt-3 w-17/20 rounded-xl bg-olive-400 p-3 lg:w-9/10 dark:bg-zinc-700">
				<div class="flex flex-row items-center justify-between gap-0.5">
					<div class="flex flex-row gap-1">
						<p class="pl-2 font-bold">{airports.find((x) => x.code == selected)?.code ?? ''}</p>
						<button
							onclick={() => {
								switchServer();
							}}
							class="group relative rounded-full bg-olive-300 p-1 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-800 {selected
								? 'visible'
								: 'invisible'}"
						>
							<span
								class="absolute z-20 w-max -translate-x-1/2 -translate-y-7 self-center rounded-md bg-olive-200 p-1 text-xs opacity-0 transition-all group-hover:-translate-y-8.5 group-hover:opacity-100 dark:bg-zinc-600 dark:text-white"
								>Switch ATC server</span
							>
							<!-- Arrow -->
							<div
								class="absolute aspect-square w-4 -translate-y-4.5 rotate-45 rounded-xs bg-olive-200 opacity-0 transition-all group-hover:-translate-y-6 group-hover:opacity-100 dark:bg-zinc-600"
							></div>
							<img
								class="aspect-square w-4 transition-transform duration-700 dark:invert"
								src={Refresh}
								style="transform: rotate({rotation}deg);"
								alt="Switch ATC Server"
							/></button
						>
					</div>
					<div class="flex flex-row items-center gap-0.5">
						<p
							class="indicator text-2xl text-red-500"
							class:text-red-500={connected >= 3}
							class:text-yellow-500={connected < 3 && selected != '' && error < 2}
							class:text-gray-600={selected == '' || error == 2}
							class:animate-pulse={connected >= 3}
						>
							•
						</p>
						<p class="">
							{connected < 3 && selected == ''
								? 'No connection'
								: connected < 3
									? error == 0
										? 'Connecting'
										: error == 1
											? 'Switching'
											: error == 2
												? 'Unavailable'
												: ''
									: 'LIVE'}
						</p>
					</div>
				</div>
				<div class="flex max-w-10/10 flex-row items-center justify-between gap-1">
					<p class="max-w-8/10 rounded-xl bg-olive-300 p-2 dark:bg-zinc-800">
						{airports.find((x) => x.code == selected)?.name ?? 'No airport selected'}
					</p>
					<button
						onclick={() => {
							selectOpen = true;
						}}
						class="rounded-xl bg-olive-300 p-1 px-2.5 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-800 dark:text-white"
						>Select</button
					>
				</div>
			</div>
			<!-- /SELECTED STATION -->
			<!-- SELECTED RADIO -->
			<div class="mt-3 w-17/20 rounded-xl bg-olive-400 p-3 lg:w-9/10 dark:bg-zinc-700">
				<div class="selectradio relative w-full transition-transform select-none">
					<button
						onclick={() => {
							radioSelectOpen = !radioSelectOpen;
						}}
						class="flex w-full flex-row justify-between rounded-xl bg-olive-300 p-2 px-3 hover:cursor-pointer dark:bg-zinc-600"
					>
						<div class="flex flex-row items-center gap-1">
							<p>{selectedRadio}</p>
							<img
								alt="spinner"
								src={Refresh}
								class:scale-100={mConnected < 3 && selectedRadio}
								class="w-4 scale-0 animate-spin transition-transform dark:invert"
							/>
						</div>

						<img
							src={Arrow}
							class:-scale-100={radioSelectOpen}
							class="aspect-square w-6 transition-transform duration-300 dark:invert"
							alt="arrow"
						/>
					</button>
					<div
						class="absolute flex w-full flex-col items-center justify-center gap-1 rounded-b-2xl bg-olive-400 p-3 dark:bg-zinc-700"
						class:hidden={!radioSelectOpen}
					>
						{#each radioStations.filter((x) => x.name != selectedRadio) as station}
							<button
								onclick={() => {
									if (ms.paused) {
										ms.src = station.uri;
										selectedRadio = station.name;
									} else {
										ms.src = station.uri;
										selectedRadio = station.name;
										ms.play();
									}
									radioSelectOpen = false;
								}}
								class="w-9/10 rounded-xl bg-olive-300 p-2 text-center transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-600 dark:text-white"
							>
								{station.name}
							</button>
						{/each}
					</div>
				</div>
			</div>
			<!-- /SELECTED RADIO -->

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
			<p class="text-xs text-olive-600 dark:text-zinc-500!">Ad playing?</p>
			<button
				onclick={() => {
					window.location.reload();
				}}
				class="text-xs text-olive-700 hover:cursor-pointer hover:underline dark:text-zinc-400!"
				>Reload the page</button
			>
		</div>
	</div>
</div>
<!-- LIGHT DARK -->
<div
	class="absolute bottom-1/50 left-1/2 flex h-fit w-fit -translate-x-1/2 scale-75 flex-row items-center justify-center gap-0.5 rounded-full bg-olive-300 p-2 dark:bg-zinc-700"
>
	<button
		class="rounded-full bg-olive-400 p-1 transition-transform hover:scale-105 hover:cursor-pointer dark:scale-85 dark:bg-zinc-800 dark:hover:scale-90"
		onclick={setLight}
		><img alt="Toggle light-mode" class="aspect-square w-10 dark:invert" src={Sun} /></button
	>
	<button
		class="scale-85 rounded-full bg-olive-400 p-1 transition-transform hover:scale-90 hover:cursor-pointer dark:scale-100 dark:bg-zinc-800 dark:hover:scale-105"
		onclick={setDark}
		><img alt="Toggle dark-mode" class="aspect-square w-10 dark:invert" src={Moon} /></button
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
				><img class="aspect-square w-10 dark:invert" src={Cross} alt="Close" /></button
			>
			<div class="flex h-full w-full items-center justify-center"><h2>SELECT AIRPORT</h2></div>
		</div>
	</div>
	<!-- SEARCH BAR -->
	<div class="flex flex-col items-center justify-center gap-2">
		<input
			class="w-7/10 max-w-70 rounded-xl bg-olive-400 p-4 text-2xl sm:w-4/10 sm:max-w-85 sm:min-w-70 dark:bg-zinc-900 dark:text-white {searchMode ==
			0
				? 'uppercase'
				: ''}"
			maxlength={searchMode == 0 ? 4 : 50}
			bind:value={searchTerm}
			type="text"
			placeholder={searchMode == 0 ? 'ICAO Code' : 'Airport name'}
		/>
		<button
			onclick={() => {
				searchMode == 0 ? (searchMode = 1) : (searchMode = 0);
				searchTerm = '';
			}}
			class=" max-w-7/10 rounded-2xl bg-olive-400 p-2 px-3 transition-transform hover:scale-105 hover:cursor-pointer dark:bg-zinc-900 dark:text-white"
			>Search by {searchMode == 0 ? 'Airport Name' : 'ICAO Code'}</button
		>

		{#if !searchTerm}
			<div class="flex flex-row items-center justify-between gap-2">
				<hr class="w-16 dark:text-white" />
				<p class="">OR</p>
				<hr class="w-16 dark:text-white" />
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
				class="w-7/10 max-w-70 rounded-2xl bg-olive-400 p-4 text-2xl transition-transform hover:scale-105 hover:cursor-pointer sm:w-3/10 sm:max-w-85 sm:min-w-70 dark:bg-zinc-900 dark:text-white"
				>Random airport</button
			>
		{:else}
			<div class="flex h-3/10 w-7/10 flex-col items-center justify-center gap-1.5 p-4 lg:w-3/10">
				{#each airports
					.filter((x) => {
						if (searchMode == 0) return x.code.includes(searchTerm.toUpperCase());
						else {
							return x.name.toLowerCase().includes(searchTerm.toLowerCase());
						}
					})
					.slice(0, 6) as airport}
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
						class="flex w-full flex-col justify-baseline rounded-2xl bg-olive-400 p-2 pl-3 transition-transform hover:scale-102 hover:cursor-pointer sm:max-w-90 dark:border-white dark:bg-zinc-900"
					>
						<p class="self-start font-bold">{airport.code}</p>
						<p class="w-9/10 self-start truncate text-left">{airport.name}</p>
					</button>
				{/each}
				{#if airports.filter((x) => {
					if (searchMode == 0) return x.code.includes(searchTerm.toUpperCase());
					else {
						return x.name.toLowerCase().includes(searchTerm.toLowerCase());
					}
				}).length > 6}
					<p>
						6/{airports.filter((x) => {
							if (searchMode == 0) return x.code.includes(searchTerm.toUpperCase());
							else {
								return x.name.toLowerCase().includes(searchTerm.toLowerCase());
							}
						}).length} results
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
