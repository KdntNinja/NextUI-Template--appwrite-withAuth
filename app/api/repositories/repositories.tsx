import React, { useEffect, useState } from 'react';
import { storage } from '@/app/appwrite';

const bucketId = '66f43f4d001dca54762b';

interface Repository {
  id: string;
  name: string;
}

const Repositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const files = await storage.listFiles(bucketId);
        const repos = files.files.map((file: { $id: string; name: string }) => ({
          id: file.$id,
          name: file.name,
        }));
        setRepositories(repos);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <div>
      <h1>Your Repositories</h1>
      {repositories.length > 0 ? (
        repositories.map((repo) => (
          <div key={repo.id}>
            <p>{repo.name}</p>
          </div>
        ))
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
  );
};

export default Repositories;