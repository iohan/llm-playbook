import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { create } from 'zustand';

interface SettingsState {
  sidebarOpen: boolean;
  expandedMenuIds: string[];

  hydrated: boolean; // When true, indicates that the state has been loaded from localStorage

  toggleSidebar: () => void;
  toggleMenu: (id: string) => void;
  setExpandedMenus: (ids: string[]) => void;
  isMenuExpanded: (id: string) => boolean;
  setHydrated?: (v: boolean) => void;
}

const useSettings = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // defaults
        sidebarOpen: true,
        expandedMenuIds: [],
        hydrated: false,

        // actions
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), undefined, 'toggleSidebar'),
        toggleMenu: (id: string) =>
          set((state) => {
            const isExpanded = state.expandedMenuIds.includes(id);
            const expandedMenuIds = isExpanded
              ? state.expandedMenuIds.filter((menuId) => menuId !== id)
              : [...state.expandedMenuIds, id];
            return { expandedMenuIds };
          }),

        setExpandedMenus: (ids: string[]) => set({ expandedMenuIds: ids }),
        isMenuExpanded: (id: string) => get().expandedMenuIds.includes(id),
        setHydrated: (v) => set({ hydrated: v }),
      }),
      {
        name: 'settings-storage', // unique name
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          expandedMenuIds: state.expandedMenuIds,
        }), // only persist these parts of the state
        onRehydrateStorage: () => {
          return () => {
            useSettings.setState({ hydrated: true });
          };
        },
      },
    ),
  ),
);

export default useSettings;
