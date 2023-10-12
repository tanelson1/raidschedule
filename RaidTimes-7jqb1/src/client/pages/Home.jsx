import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getRaids from '@wasp/queries/getRaids';
import scheduleRaid from '@wasp/actions/scheduleRaid';
import registerForRaid from '@wasp/actions/registerForRaid';
import registerAsAlternate from '@wasp/actions/registerAsAlternate';
import declineRaid from '@wasp/actions/declineRaid';

export function HomePage() {
  const { data: raids, isLoading, error } = useQuery(getRaids);
  const scheduleRaidFn = useAction(scheduleRaid);
  const registerForRaidFn = useAction(registerForRaid);
  const registerAsAlternateFn = useAction(registerAsAlternate);
  const declineRaidFn = useAction(declineRaid);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  const handleScheduleRaid = ({ description, scheduledTime }) => {
    scheduleRaidFn({ description, scheduledTime });
  };

  const handleRegisterForRaid = ({ raidId, status }) => {
    registerForRaidFn({ raidId, status });
  };

  const handleRegisterAsAlternate = ({ raidId }) => {
    registerAsAlternateFn({ raidId });
  };

  const handleDeclineRaid = ({ raidId }) => {
    declineRaidFn({ raidId });
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <h1 className='text-2xl font-bold'>Raid Times</h1>
      </div>
      <div className='mb-4'>
        <h2 className='text-lg font-bold'>Upcoming Raids</h2>
        {raids.map((raid) => (
          <div key={raid.id} className='bg-gray-100 p-4 mb-4 rounded-lg'>
            <div>{raid.description}</div>
            <div>{raid.scheduledTime}</div>
            <div>Registered Users: {raid.RaidRegistration.length}</div>
            <div>Max Members: {raid.maxMembers}</div>
            <div>
              <button
                onClick={() => handleRegisterForRaid({ raidId: raid.id, status: 'definite' })}
                className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
              >
                Register as Definite
              </button>
              <button
                onClick={() => handleRegisterForRaid({ raidId: raid.id, status: 'alternate' })}
                className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ml-2'
              >
                Register as Alternate
              </button>
              <button
                onClick={() => handleDeclineRaid({ raidId: raid.id })}
                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2'
              >
                Decline Raid
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className='text-lg font-bold'>Schedule a Raid</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const description = e.target.description.value;
            const scheduledTime = e.target.scheduledTime.value;
            handleScheduleRaid({ description, scheduledTime });
            e.target.reset();
          }}
        >
          <div className='mb-2'>
            <label htmlFor='description'>Description:</label>
            <input
              type='text'
              id='description'
              name='description'
              className='px-1 py-2 border rounded'
              required
            />
          </div>
          <div className='mb-2'>
            <label htmlFor='scheduledTime'>Scheduled Time:</label>
            <input
              type='datetime-local'
              id='scheduledTime'
              name='scheduledTime'
              className='px-1 py-2 border rounded'
              required
            />
          </div>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Schedule Raid
          </button>
        </form>
      </div>
    </div>
  );
}