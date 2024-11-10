/** @format */

import React, { useState, useEffect } from 'react';
import {
	Button,
	TextField,
	Typography,
	CircularProgress,
	Divider,
	ThemeProvider,
	createTheme,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import Slider from 'react-slick'; // Import react-slick
import History from './History';

// Create a theme using Poppins font
const theme = createTheme({
	typography: {
		fontFamily: ['Poppins', 'sans-serif'].join(','),
	},
});

export default function Home() {
	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState('');

	const handleCheckFact = async () => {
		if (!url) {
			setError('Please enter a valid URL or text');
			return;
		}
		setError('');
		setLoading(true);

		try {
			// Make the real API call to localhost:5000/api/claims
			const response = await fetch('http://localhost:5000/api/claims', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query: url }), // Send the URL or text as 'input'
			});

			const data = await response.json();

			// Update result with the API response
			const formattedData = {
				facts: [
					{
						fact: url,
						score: data.result ? 10 : 2,
						isTrue: data.result,
						resources: [{ title: 'Source', url: data.url }],
					},
				],
			};

			setResult(formattedData);
		} catch (error) {
			console.error('Error fetching fact-check data:', error);
			setError('Failed to fetch data. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	// Slick Carousel settings
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
	};

	// Use useEffect to auto-populate the search bar with 'q' from URL params
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const query = urlParams.get('q');
		if (query) {
			setUrl(decodeURIComponent(query)); // Decode URL-encoded query
		}
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div className='h-screen flex flex-col'>
				<History />
				<div className='flex justify-center items-center bg-white mt-[4rem]'>
					<div className='w-full space-y-8'>
						{/* Main Card */}
						<div className=''>
							<div className='p-4'>
								<Typography
									variant='h4'
									className='text-center text-black font-bold'>
									Truth Lens
								</Typography>
							</div>
							<div className='mx-12'>
								<TextField
									placeholder='Enter URL or text'
									label='Enter URL or text'
									fullWidth
									variant='outlined'
									value={url}
									onChange={(e) => setUrl(e.target.value)}
									error={Boolean(error)}
									helperText={error || ''}
									InputProps={{
										endAdornment: loading ? (
											<CircularProgress size={24} />
										) : null,
									}}
									className='transition-all rounded-lg p-4 bg-white'
								/>
							</div>
							<div className='mt-6'>
								<div className='flex justify-center'>
									<Button
										variant='contained'
										color='primary'
										onClick={handleCheckFact}
										disabled={loading}
										className='w-1/3 my-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform transition-all'>
										{loading ? 'Checking...' : 'Check Facts'}
									</Button>
								</div>
							</div>
						</div>

						{/* Fact Check Results - Carousel */}
						{result && (
							<div className='flex items-center justify-center bg-white mt-12'>
								<div
									className='p-8 w-1/2 items-center justify-center rounded-xl shadow-2xl'
									style={{ backgroundColor: 'transparent' }}>
									<div className='mb-6 font-bold'>
										<Typography
											variant='h5'
											className='text-center text-black font-bold mb-6'>
											Truth Lens Results
										</Typography>
									</div>
									<Divider />

									{/* Carousel Slider */}
									<Slider
										{...settings}
										className='bg-transparent'
										style={{ background: 'transparent' }}>
										{result.facts.map((fact, index) => (
											<div
												key={index}
												className='space-y-4 bg-transparent'>
												<Typography
													variant='h6'
													className='font-medium text-black'>
													Fact: {fact.fact}
												</Typography>
												<Typography
													variant='body2'
													className='text-black'>
													Score: {fact.score}/10
												</Typography>

												<div className='mt-2'>
													{fact.isTrue ? (
														<CheckCircle
															className='text-green-500 mx-auto'
															style={{ fontSize: 40 }}
														/>
													) : (
														<Cancel
															className='text-red-500 mx-auto'
															style={{ fontSize: 40 }}
														/>
													)}
												</div>

												<Typography
													variant='body2'
													className='text-black mt-4'>
													Relevant Resources:
												</Typography>
												<ul className='space-y-2 mt-2'>
													{fact.resources.map((resource, idx) => (
														<li key={idx}>
															<a
																href={resource.url}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-500 hover:underline'>
																{resource.title}
															</a>
														</li>
													))}
												</ul>
												<Divider className='my-4' />
											</div>
										))}
									</Slider>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
}
