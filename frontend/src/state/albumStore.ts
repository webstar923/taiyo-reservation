import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';


// Define the store state type
interface AlbumStore {
  sortBy: string;
  isSidebarOpen: boolean;
  isMobile: boolean;
  isAlbumModalOpen: boolean;
  isUploadModalOpen: boolean;
  albumId: string | null;
  dropDownList: string[];
  uploadUrls: Record<string, { original: string; compressed: string; fetchedAt: number; expiresIn: number; used: boolean }[]>;

  setSortBy: (sortBy: string) => void;
  toggleSidebar: () => void;
  setIsMobile: (newState: boolean) => void;
  setAlbumModalOpen: (isOpen: boolean) => void;
  setUploadModalOpen: (isOpen: boolean) => void;
  setAlbumId: (id: string | null) => void;
  setUploadUrls: (
    albumId: string, 
    urlPairs: { original: string; compressed: string; }[]
  ) => void;
  getValidUploadUrls: (albumId: string) => { original: string; compressed: string }[] | undefined;
  cleanupInvalidUploadUrls: (albumId: string) => void;
  markUrlAsUsed: (albumId: string, url: { original: string; compressed: string }) => void;
}

// Zustand store for managing album-related state
export const useAlbumStore = create<AlbumStore>()(
  persist(
    (set, get) => ({
      sortBy: 'Most Recent',
      setSortBy: (sortBy: string) => set({ sortBy }),

      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      isMobile: false,
      setIsMobile: (newState: boolean) => set({ isMobile: newState }),

      isAlbumModalOpen: false,
      isUploadModalOpen: false,
      albumId: null,
      editingAlbum: null,
      dropDownList: ['Most Recents', 'Newest', 'Oldest'],

      setAlbumModalOpen: (isOpen: boolean) => set({ isAlbumModalOpen: isOpen }),
      setUploadModalOpen: (isOpen: boolean) => set({ isUploadModalOpen: isOpen }),
      setAlbumId: (id: string | null) => set({ albumId: id }),

      uploadUrls: {},
      setUploadUrls: (albumId: string, urlPairs: { original: string; compressed: string; }[]) =>
        set((state) => {
          const newUploadUrls = urlPairs.map((urlPair) => ({
            ...urlPair,
            used: false,
            expiresIn: 3600,
            fetchedAt: Date.now(),
          }));

          const currentUrls = state.uploadUrls[albumId] || [];

          if (JSON.stringify(newUploadUrls) !== JSON.stringify(currentUrls)) {
            return {
              uploadUrls: { ...state.uploadUrls, [albumId]: newUploadUrls },
            };
          }

          return state; // No change in state
        }),

        getValidUploadUrls: (albumId: string) => {
          const urls = get().uploadUrls[albumId];
          if (!urls) return undefined;

          const currentTime = Date.now();
          return urls
            .filter(({ fetchedAt, expiresIn, used }) => currentTime < fetchedAt + expiresIn * 1000 && !used)
            .map(({ original, compressed }) => ({ original, compressed }));
        },

        cleanupInvalidUploadUrls: (albumId: string) => {
          const urls = get().uploadUrls[albumId];
          if (!urls) return;
        
          const currentTime = Date.now();
          const validUrls = urls.filter(({ fetchedAt, expiresIn }) => currentTime < fetchedAt + expiresIn * 1000);
        
          set((state) => ({ uploadUrls: { ...state.uploadUrls, [albumId]: validUrls } }));
        },

        markUrlAsUsed: (albumId: string, url: { original: string, compressed: string}) => {
          set((state) => {
            const updatedUrls = state.uploadUrls[albumId]?.map((urlPair) => 
              urlPair.original === url.original && urlPair.compressed === url.compressed
              ? { ...urlPair, used: true }
              : urlPair
            );
            return {
              uploadUrls: { ...state.uploadUrls, [albumId]: updatedUrls || [] }
            };
          });
        }
    }),
    {
      name: 'upload-urls-store', // Name of the key in storage
      storage: createJSONStorage(() => localStorage), // Wrap localStorage in createJSONStorage
      partialize: (state) => ({ uploadUrls: state.uploadUrls }), // Persist only `uploadUrls`

      onRehydrateStorage: (state) => {
        if (state) {
          console.log('State successfully rehydrated from localStorage:', state);
        } else {
          console.log('Error rehydrating state from localStorage');
        }
      }
    }
  )
);
