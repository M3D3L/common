import usePocketBase from './usePocketbase';
import useFiles from './useFiles';
import type { RecordModel } from 'pocketbase';

export default function useUsers() {
  const pb = usePocketBase();
  const { uploadFile } = useFiles();

  /**
   * Get user profile
   */
  async function fetchUserProfile(userId: string): Promise<RecordModel> {
    try {
      return await pb.collection('users').getOne(userId, {
        expand: 'posts(author)'
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async function updateUserProfile(
    userId: string,
    profileData: {
      username?: string;
      bio?: string;
      avatar?: File;
      social?: Record<string, string>;
    }
  ): Promise<RecordModel> {
    if (!pb.authStore.model || pb.authStore.model.id !== userId) {
      throw new Error('Unauthorized');
    }

    try {
      let updateData = { ...profileData };

      // Handle avatar upload separately if provided
      if (profileData.avatar) {
        return await uploadFile(profileData.avatar, 'users', userId, 'avatar');
      }

      return await pb.collection('users').update(userId, updateData);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  return {
    fetchUserProfile,
    updateUserProfile
  };
}