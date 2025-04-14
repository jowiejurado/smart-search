import { useTheme } from "@/context/ThemeContext";
import Icon from "@mdi/react";
import { mdiThemeLightDark } from "@mdi/js";

const ButtonToggle = () => {
	const { theme, setTheme }: any = useTheme();
	return (
		<button
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="rounded-full p-2 hover:bg-gray-300 transition-all"
		>
			<Icon path={mdiThemeLightDark} size={1} className="dark:text-gray-500" />
		</button>
	);
};

export default ButtonToggle;
