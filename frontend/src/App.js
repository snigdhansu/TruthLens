/** @format */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import Home from './routes/Home';
import History from './routes/History';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
	return (
		<Router>
			<CssBaseline /> {/* Ensures consistent styling across browsers */}
			<Routes>
				{/* Define the homepage route */}
				<Route
					path='/'
					element={<Home />}
				/>
				<Route
					path='/history'
					element={<History />}
				/>
			</Routes>
		</Router>
	);
}

export default App;
