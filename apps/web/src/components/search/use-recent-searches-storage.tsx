import { useLocalStorage } from '~/utils/useLocalStorage';

const SEARCH_LOCAL_STORAGE_KEY = '__TYPEHERO_SEARCH__';

interface UseRecentSearchesStorageProps {
  limit?: number;
}

interface Item {
  id: number | string;
}

export function useRecentSearchesStorage({ limit = 5 }: UseRecentSearchesStorageProps = {}) {
  const [storage, setStorage] = useLocalStorage(SEARCH_LOCAL_STORAGE_KEY, '[]');

  const getItems = () => {
    return JSON.parse(storage) as Item[];
  };

  return {
    getItems,
    onAdd(item: Item) {
      try {
        const items = getItems();
        const exists = items.some((i) => i.id === item.id);

        if (exists) {
          return;
        }

        if (items.length >= limit) {
          items.pop();
        }

        setStorage(JSON.stringify([item, ...items]));
      } catch (error) {
        console.error(error);
      }
    },
    onRemove(item: Item['id']) {
      try {
        const items = getItems();
        const newItems = items.filter((i) => i.id !== item);
        setStorage(JSON.stringify(newItems));
      } catch (error) {
        console.error(error);
      }
    },
  };
}
