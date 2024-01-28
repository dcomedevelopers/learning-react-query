import { useMutation, useQuery } from 'react-query';

import client from './client';

export interface Resource {
    id: string;
    content: string;
}

export interface ResourceInput {
    content: string;
}

export const useCreateResource = () => {
    return useMutation<Resource, Error, ResourceInput>(
        async (newResource) => {
            const response = await fetch('http://localhost:3000/api/resource', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newResource),
            });

            if (!response.ok) {
                throw new Error('Failed to create resource');
            }

            return response.json();
        },
        {
            onSuccess: () => {
                // Invalidate and refetch the resource list query after a successful creation
                client.invalidateQueries('resourceList');
            },
        }
    );
};

export const useFetchResources = () => {
    return useQuery<Resource[], Error>(
        'resourceList',
        async () => {
            const response = await fetch('http://localhost:3000/api/resources');

            if (!response.ok) {
                throw new Error('Failed to fetch resources');
            }

            return response.json();
        }
    );
};

export const useDeleteResource = () => {
    return useMutation<void, Error, string>(
        async (resourceId: string) => {
          const response = await fetch(`http://localhost:3000/api/resource/${resourceId}`, {
            method: 'DELETE',
          });
    
          if (!response.ok) {
            throw new Error('Failed to delete resource');
          }
        },
        {
          // Use onMutate to store a copy of the resource before deletion
          onMutate: async (resourceId) => {
            // Cancel any outgoing refetches (stops them from updating the outdated cache)
            await client.cancelQueries(['resource', resourceId]);
    
            // Optimistically update the cache to remove the resource
            client.setQueryData<Resource[]>(
                'resourceList',
                (prevData) => prevData?.filter((resource) => resource.id !== resourceId) || []
            );
          },
          // Use onSettled to check for errors and re-fetch if needed
          onSettled: (data, error, resourceId) => {
            // If there was an error during deletion, refetch
            if (error) {
                client.invalidateQueries(['resource', resourceId]);
            }
          }
        }
      );
}