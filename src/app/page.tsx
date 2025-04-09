'use client';
import { InstantSearch } from 'react-instantsearch';
import { typesenseInstantsearchAdapter } from '@/util/typesense';
import { ThemeProvider } from '@/context/ThemeContext';
import SearchWithFilter from '@/components/molecules/search-input/SearchWithFilter';
import ButtonToggle from '@/components/atoms/button-toggle/ButtonToggle';
import { Autocomplete } from '@/components/atoms/autocomplete/AutoComplete';

const Home = () => {
	return (
		<>
			<ThemeProvider>
				<main className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 dark:text-white">
					<div className="absolute top-6 right-6">
						<ButtonToggle />
					</div>
					<SearchWithFilter />
				</main>
			</ThemeProvider>
		</>
	);
}

export default Home
