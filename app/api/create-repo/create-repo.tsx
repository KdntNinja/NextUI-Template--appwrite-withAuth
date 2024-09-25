import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { storage } from '@/app/appwrite';

const bucketId = '66f43f4d001dca54762b';

const CreateRepo = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleCreateRepository = async () => {
    try {
      const userId = 'your-user-id'; // Replace with actual user ID
      const fileId = `${userId}/${name}-${Date.now()}`;
      const file = new File([description], `${name}.txt`, { type: 'text/plain' });

      await storage.createFile(bucketId, fileId, file, ['role:member']);

      await router.push('/repositories');
    } catch (error) {
      console.error('Failed to create repository:', error);
    }
  };

  return (
    <div>
      <h1>Create New Repository</h1>
      <input
        type="text"
        placeholder="Repository Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Repository Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateRepository}>Create Repository</button>
    </div>
  );
};

export default CreateRepo;