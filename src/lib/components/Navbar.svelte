<script lang="ts">
	import { Button, DarkMode, Dropdown, DropdownItem, Navbar, NavBrand, NavHamburger, NavUl } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import '../../app.css';
	import { contextRoute } from '$lib/routes';
	import { activeContext, contexts } from '$lib/stores/contexts.js';

	export let fluid = true;
	export let drawerHidden = false;

	function updateContextButton(event: Event) {
		if (!event.target) return;
		activeContext.set((event.target as HTMLInputElement).name);
	}
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavContainer class="-mb-2 -mt-2 -px-1" {fluid}>
		<NavHamburger
			onClick={() => (drawerHidden = !drawerHidden)}
			class="m-0 me-3 md:block lg:hidden"
		/>
		<NavBrand href="/" class='lg:w-60'>
			<img
				src="/images/flowbite-svelte-icon-logo.svg"
				class="me-2.5 h-6 sm:h-8"
				alt="Annex Logo"
			/>
			<span
				class="ml-px self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
			>
				Annex
			</span>
		</NavBrand>
		<div class="hidden lg:block lg:ps-3">
			{#if $contexts}
				<NavUl class="ml-2" activeUrl="/" activeClass="text-primary-600 dark:text-primary-500">
					<Button size="sm"> {$activeContext ? $activeContext : 'Select context'}
						<ChevronDownOutline />
					</Button>
					<Dropdown class="z-20 w-44">
						{#each $contexts as context}
							<DropdownItem href={contextRoute(context)} on:click={updateContextButton}
														name="{context}">{context}</DropdownItem>
						{/each}
					</Dropdown>
				</NavUl>
			{/if}
		</div>
		<div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
			<DarkMode />
		</div>
	</NavContainer>
</Navbar>