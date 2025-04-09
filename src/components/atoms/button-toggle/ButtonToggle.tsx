import { useTheme } from "@/context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

const ButtonToggle = () => {
	const { theme, setTheme }: any = useTheme();
	return (
		<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full p-2 hover:bg-gray-300 transition-all">
			{ theme === 'light' ? (
				<SunIcon className="w-6 h-6 dark:text-gray-500" />
			) : (
				<MoonIcon className="w-5 h-5 dark:text-gray-500" />
			)}

		</button>
	);
}

export default ButtonToggle
