/** @format */

import React, { useState } from 'react';
import { Button, Card, Divider, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const History = () => {
	// State to manage visibility of the history
	const [showHistory, setShowHistory] = useState(false);

	// Example data for history
	const [historyData, setHistoryData] = useState([
		{
			url: 'https://example.com/fact1',
			timestamp: '2024-11-09 10:00 AM',
			status: false,
			facts: [
				{
					fact: 'The moon is made of cheese.',
					score: 2,
					isTrue: false,
					resources: [{ title: 'Moon facts', url: 'https://example.com/moon' }],
				},
			],
		},
		{
			url: 'https://example.com/fact2',
			timestamp: '2024-11-08 09:00 AM',
			status: true,
			facts: [
				{
					fact: 'The Earth is round.',
					score: 9,
					isTrue: true,
					resources: [
						{ title: 'Earth facts', url: 'https://example.com/earth' },
					],
				},
			],
		},
	]);

	// Function to handle rechecking a fact
	const handleRecheck = (url) => {
		console.log('Rechecking the fact for:', url);
		// Replace with actual API call to recheck the URL
	};

	// Function to handle viewing the history results
	const handleViewHistory = (url) => {
		console.log('Viewing history for:', url);
		// You can navigate to a new page or show the detailed result view for that URL
	};

	// Function to toggle the history visibility
	const handleHistoryToggle = () => {
		setShowHistory(!showHistory);
	};

	// Function to clear history (optional)
	const handleClearHistory = () => {
		setHistoryData([]);
	};

	return (
		<div>
			{/* Header Section with Show History Button */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}>
				<div className='flex justify-between items-center p-4'>
					<Typography
						variant='h4'
						className='text-center text-black font-bold'>
						Truth Lens
					</Typography>
					<Button
						variant='outlined'
						color='secondary'
						onClick={handleHistoryToggle}
						className='text-black'>
						{showHistory ? 'Hide History' : 'Show History'}
					</Button>
				</div>
			</motion.div>

			{/* History Section */}
			{showHistory && (
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, type: 'spring', stiffness: 50 }}>
					<div className='flex justify-center items-center bg-white mt-12'>
						<Card className='p-8 w-3/4 rounded-xl shadow-2xl'>
							<Typography
								variant='h5'
								className='text-center text-black font-bold mb-6'>
								Previous Fact Checks
							</Typography>
							<Divider />

							{/* History List */}
							<div className='space-y-4'>
								{historyData.map((entry, idx) => (
									<Card
										key={idx}
										className='p-4 my-4 rounded-xl bg-gray-800 text-black'>
										<Typography
											variant='h6'
											className='font-medium'>
											URL: {entry.url}
										</Typography>
										<Typography
											variant='body2'
											className='mt-2'>
											Checked on: {entry.timestamp}
										</Typography>
										<Typography
											variant='body2'
											className='mt-2'>
											Status: {entry.status ? 'True' : 'False'}
										</Typography>

										{/* Recheck and View Buttons */}
										<div className='flex mt-4 space-x-4'>
											<Button
												variant='outlined'
												color='primary'
												onClick={() => handleRecheck(entry.url)}
												className='w-1/2'>
												Recheck
											</Button>
											<Button
												variant='outlined'
												color='secondary'
												onClick={() => handleViewHistory(entry.url)}
												className='w-1/2'>
												View Results
											</Button>
										</div>
									</Card>
								))}
							</div>

							{/* Clear History Button */}
							<div className='mt-4'>
								<Button
									variant='outlined'
									color='secondary'
									onClick={handleClearHistory}
									className='mt-4'>
									Clear History
								</Button>
							</div>
						</Card>
					</div>
				</motion.div>
			)}
		</div>
	);
};

export default History;
