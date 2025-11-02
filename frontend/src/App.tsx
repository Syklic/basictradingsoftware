import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ThemeCustomizer from "./components/ThemeCustomizer";
import SettingsDialog from "./components/SettingsDialog";
import MultiViewNav from "./components/navigation/MultiViewNav";
import Breadcrumbs from "./components/navigation/Breadcrumbs";
import ViewContainer from "./components/views/ViewContainer";
import { getFromStorage, saveToStorage } from "./utils/storage";

function App() {
	const [isThemeOpen, setIsThemeOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	useEffect(() => {
		const saved = getFromStorage<string | null>("theme", null);
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const shouldBeDark = saved ? saved === "dark" : prefersDark;
		if (shouldBeDark) {
			document.documentElement.classList.add("dark");
		}
	}, []);

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Navigation */}
			<Navbar isConnected={true} onThemeOpen={() => setIsThemeOpen(true)} />

			{/* Main Layout */}
			<div className="flex h-screen pt-16">
				{/* Multi-View Navigation */}
				<MultiViewNav />

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: "256px" }}>
					{/* Breadcrumbs */}
					<Breadcrumbs />

					{/* View Container */}
					<ViewContainer />
				</div>
			</div>

			{/* Modals */}
			{isThemeOpen && <ThemeCustomizer onClose={() => setIsThemeOpen(false)} />}

			{isSettingsOpen && <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
		</div>
	);
}

export default App;
