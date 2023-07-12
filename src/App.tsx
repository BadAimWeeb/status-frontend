import { AppBar, Paper, ThemeProvider, Toolbar, Typography, CircularProgress, Container, List, ListItem, ListItemText, Tooltip, Divider, Chip } from "@mui/material";

import LIGHT_THEME from './theme/light';
import DARK_THEME from './theme/dark';
import { useState, useEffect } from "react";

import { useConnector } from "./connector";

import { hasFlag } from 'country-flag-icons';
import * as countryFlagIcons from 'country-flag-icons/react/3x2';

function App() {
	const connector = useConnector();

	const [darkMode] = useState(true);
	const [servers, setServers] = useState<{
		name: string;
		online: boolean;
		roughPing: number;
		lastUpdated: number;
		info: {
			ipv4: "NATIVE" | "NAT" | "TUNNEL" | "NONE";
			ipv6: "NATIVE" | "NAT" | "TUNNEL" | "NONE";
			country?: string;
			region?: string;
		}
	}[]>([]);

	useEffect(() => {
		let interval = setInterval(async () => {
			let x = await connector.socket?.p.status();
			if (x) {
				let v = Object.entries(x).map(([name, server]) => ({
					name,
					online: server.online,
					roughPing: Math.round(server.ping),
					lastUpdated: server.lastUpdated,
					info: server.info
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
					<Divider>
						<Chip label="Servers" />
					</Divider>
					<List sx={{ width: '100%' }}>
						{servers.map((server, index) => {
							let altCountryName = server.info.country === "UK" ? "GB" : (server.info.country ?? "?");
							let Flag = countryFlagIcons[altCountryName as keyof typeof countryFlagIcons];

							return (
								<Paper elevation={2} sx={{ mb: 2 }} key={`servers-${index}`}>
									<ListItem alignItems="flex-start">
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
											secondary={
												<div style={{ display: "flex", alignItems: "center" }}>
													<Typography variant="caption" sx={{ mr: 1 }}>Flags: </Typography>
													<Tooltip title={server.info.ipv4} placement="top">
														<Typography variant="caption"
															color={
																server.info.ipv4 === "NATIVE" ? "lightgreen" :
																	server.info.ipv4 === "NONE" ? "red" : "yellow"
															}
															sx={{ mr: 1 }}
														>IPv4</Typography>
													</Tooltip>
													<Tooltip title={server.info.ipv6} placement="top">
														<Typography variant="caption"
															color={
																server.info.ipv6 === "NATIVE" ? "lightgreen" :
																	server.info.ipv6 === "NONE" ? "red" : "yellow"
															}
															sx={{ mr: 1 }}
														>IPv6</Typography>
													</Tooltip>
													<Typography variant="caption"
														sx={{ ml: 2, mr: 1 }}
													>Region:</Typography>
													<Tooltip title={server.info.country || "?"} placement="top" style={{
														display: "flex",
														alignItems: "center",
														marginRight: 4
													}}>
														<div>
															{
																hasFlag(altCountryName) ?
																	<Flag style={{
																		height: "14px"
																	}} /> :
																	<Typography variant="caption">{server.info.country || "?"}</Typography>
															}
														</div>
													</Tooltip>
													{server.info.region ?
														<Typography variant="caption">- {server.info.region}</Typography>
														: null
													}
												</div>
											}
										/>
									</ListItem>
								</Paper>
							)
						})}
					</List>
				</Container>
			</Paper>
		</ThemeProvider>
	)
}

export default App
