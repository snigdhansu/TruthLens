/** @format */

import React, { useState } from 'react';
import {
	Button,
	TextField,
	Card,
	Typography,
	CircularProgress,
	Divider,
	ThemeProvider,
	createTheme,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
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

	const mockApiResponse = () => {
		// Simulate API response with multiple facts
		setTimeout(() => {
			const mockData = {
				facts: [
					{
						fact: 'The moon is made of cheese.',
						score: 2,
						isTrue: false,
						resources: [
							{ title: 'Moon facts', url: 'https://example.com/moon' },
						],
					},
					{
						fact: 'Water boils at 100°C at sea level.',
						score: 10,
						isTrue: true,
						resources: [
							{
								title: 'Water Boiling Point',
								url: 'https://example.com/water',
							},
						],
					},
					{
						fact: 'Humans can breathe underwater without assistance.',
						score: 1,
						isTrue: false,
						resources: [
							{
								title: 'Breathing Underwater',
								url: 'https://example.com/breathing',
							},
						],
					},
				],
			};
			setResult(mockData);
			setLoading(false);
		}, 2000);
	};

	const handleCheckFact = () => {
		if (!url) {
			setError('Please enter a valid URL');
			return;
		}
		setError('');
		setLoading(true);
		mockApiResponse();
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

	return (
		<ThemeProvider theme={theme}>
			<History />
			<div className='flex justify-center items-center min-h-screen bg-white'>
				<div className='w-full space-y-8'>
					{/* Main Card */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5 }}>
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
									placeholder='Enter URL'
									label='Enter URL'
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
								<motion.div
									className='flex justify-center'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.2 }}>
									<Button
										variant='contained'
										color='primary'
										onClick={handleCheckFact}
										disabled={loading}
										className='w-1/3 my-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transform transition-all'>
										{loading ? 'Checking...' : 'Check Facts'}
									</Button>
								</motion.div>
							</div>
						</div>
					</motion.div>

					{/* Fact Check Results - Carousel */}
					{result && (
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}>
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
											<motion.div
												key={index}
												initial={{ opacity: 0, y: 30 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: 0.3 + index * 0.2,
													duration: 0.6,
												}}
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
											</motion.div>
										))}
									</Slider>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</ThemeProvider>
	);
}
