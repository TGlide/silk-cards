<script lang="ts">
	import { browser } from '$app/environment';
	import { getValueAtPercentage, range } from '$utils/array';
	import { clamp, scale } from '$utils/math';
	import { onMount } from 'svelte';

	type Configuration = {
		class: string;
		scrollBounds: [number, number];
		offsetTop?: number;
		values: Record<
			string,
			{
				values: number[];
				formatter: (value: number) => string;
				isTransform?: boolean;
			}
		>;
	};

	const configurations: Array<Configuration> = [
		{
			class: 'card-1',
			scrollBounds: [300, 1200],
			offsetTop: 100,
			values: {
				opacity: {
					values: [1, 0.75, 0.75],
					formatter: (value: number) => value.toString()
				},
				scale: {
					values: [1, 0.75, 0.75],
					formatter: (value: number) => `${value}`,
					isTransform: true
				}
			}
		},
		{
			class: 'card-2',
			scrollBounds: [900, 1250],
			offsetTop: 250,
			values: {
				opacity: {
					values: [1, 0.9],
					formatter: (value: number) => value.toString()
				},
				scale: {
					values: [1, 0.9],
					formatter: (value: number) => `${value}`,
					isTransform: true
				}
			}
		},
		{
			class: 'card-3',
			scrollBounds: [1300, 3200],
			offsetTop: 250,
			values: {
				opacity: {
					values: [1, 0],
					formatter: (value: number) => value.toString()
				},
				scale: {
					values: [1, 0.25],
					formatter: (value: number) => `${value}`,
					isTransform: true
				},
				translateX: {
					values: [0, 200, 200],
					formatter: (value: number) => `${value}px`,
					isTransform: true
				}
			}
		}
	];

	let progress = configurations.map((c) => {
		return {
			value: 0,
			eased: c.scrollBounds[0]
		};
	});

	let scroll = 0;

	const animate = () => {
		for (let i = 0; i < progress.length; i++) {
			const prog = progress[i];
			const conf = configurations[i];
			const el = document.querySelector(`.${conf.class}`) as HTMLElement;
			if (!el) continue;

			const [lb, ub] = conf.scrollBounds; // Lower and upper bounds
			const newProg = {
				value: clamp(scale(lb, ub, 0, 1, scroll + (conf.offsetTop ?? 0)), 0, 1),
				eased: prog.eased + (prog.value - prog.eased) * 0.1
			};

			const easedScroll = scale(0, 1, conf.scrollBounds[0], conf.scrollBounds[1], newProg.eased);
			let transform = `translateX(-50%) translateY(${easedScroll}px)`;

			for (const [key, value] of Object.entries(conf.values)) {
				const { values, formatter, isTransform } = value;
				const newValue = getValueAtPercentage(values, newProg.value);
				if (isTransform) {
					transform += ` ${key}(${formatter(newValue)})`;
				} else {
					el.style.setProperty(key, formatter(newValue));
				}
			}

			el.style.transform = transform;

			progress[i] = newProg;
		}

		window.requestAnimationFrame(animate);
	};

	onMount(() => {
		if (!browser) return;
		window.requestAnimationFrame(animate);
	});
</script>

<svelte:window bind:scrollY={scroll} />
<div class="wrapper">
	<span>{scroll}</span>
	<div class="phone" />
	{#each configurations as c, i}
		<div class={`card ${c.class}`}>
			{progress[i].eased.toFixed(4)}
		</div>
	{/each}
</div>

<style>
	.wrapper {
		position: relative;
		height: 9999px;
		overflow: hidden;
	}

	span {
		position: fixed;
		top: 0;
		left: 0;
	}

	.card {
		border-radius: 0.5rem;
		width: 650px;
		height: 250px;
		padding: 1rem;

		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.card-1 {
		background-color: tomato;
	}

	.card-2 {
		background-color: teal;
	}

	.card-3 {
		background-color: rebeccapurple;
		transform-origin: right;
	}

	.phone {
		position: absolute;
		top: 2900px;
		left: calc(70%);

		width: 300px;
		height: 600px;

		border: 1px solid white;
		border-radius: 0.5rem;
		background-color: black;

		transform: translateX(-50%);
	}
</style>
