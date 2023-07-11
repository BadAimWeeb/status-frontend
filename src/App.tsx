import { AppBar, Paper, ThemeProvider, Toolbar, Typography, CircularProgress, Container, List, ListItem, ListItemText } from "@mui/material";

import LIGHT_THEME from './theme/light';
import DARK_THEME from './theme/dark';
import { useState, useEffect } from "react";

import { useConnector } from "./connector";

function App() {
	const connector = useConnector();

	const [darkMode] = useState(true);
	const [servers, setServers] = useState<{
		name: string;
		online: boolean;
		roughPing: number;
		lastUpdated: number;
	}[]>([]);

	useEffect(() => {
		let interval = setInterval(async () => {
			let x = await connector.socket?.p.status();
			if (x) {
				let v = Object.entries(x).map(([name, server]) => ({
					name,
					online: server.online,
					roughPing: Math.round(server.ping),
					lastUpdated: server.lastUpdated
				}));
				setServers(v);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		}
	}, [connector]);

	return (
		<ThemeProvider theme={darkMode ? DARK_THEME : LIGHT_THEME}>
			<Paper elevation={0} style={{ borderRadius: 0, width: "100vw", minHeight: "100vh" }}>
				<AppBar position="sticky">
					<Toolbar>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
							BadAimWeeb - Service Status
						</Typography>
						<CircularProgress size={20} />
					</Toolbar>
				</AppBar>
				<Container sx={{ paddingTop: 3 }}>
					<List sx={{ width: '100%' }}>
						{servers.map((server, index) => (
							<Paper elevation={2} sx={{ mb: 2 }}>
								<ListItem alignItems="flex-start" key={`servers-${index}`}>
									<ListItemText
										primary={
											<div style={{ display: "flex", alignItems: "center" }}>
												<Typography variant="h6">{server.name}</Typography>
												<div style={{ flexGrow: 1 }}></div>
												<Typography variant="caption">{server.roughPing}ms</Typography>
												<Typography variant="body1" sx={{
													fontFamily: "monospace",
													width: 85,
													textAlign: "end",
													color: server.lastUpdated ? server.online ? "lightgreen" : "red" : "yellow"
												}}>{server.lastUpdated ? (server.online ? "Online" : "Offline") : "Probing"}</Typography>
											</div>
										}
									/>
								</ListItem>
							</Paper>
						))}
					</List>
				</Container>
			</Paper>
		</ThemeProvider>
	)
}

export default App
