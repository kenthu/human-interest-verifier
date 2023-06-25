import { ActivityData } from '../types/types';

const STORAGE_KEY = 'activityData';

const saveActivityData = (activityData: ActivityData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activityData));
};

const loadActivityData = (): ActivityData | null => {
  const stringifiedData = localStorage.getItem(STORAGE_KEY);
  if (!stringifiedData) return null;

  try {
    return JSON.parse(stringifiedData);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const resetActivityData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Hook that manages access to activityData in local storage
 */
export const useSavedActivityData = () => {
  return {
    saveActivityData,
    loadActivityData,
    resetActivityData,
  };
};
