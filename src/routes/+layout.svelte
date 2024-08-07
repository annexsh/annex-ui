<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let drawerHidden = false;
</script>

<header class="fixed top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
	<Navbar bind:drawerHidden />
</header>
<div class="overflow-hidden lg:flex">
	<Sidebar bind:drawerHidden />
	<div class="relative h-full w-full overflow-y-auto lg:ml-64 pt-[70px]">
		<slot />
	</div>
</div>
