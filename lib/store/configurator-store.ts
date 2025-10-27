import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import {
  COLOR_VARIANTS,
  ENVIRONMENT_OPTIONS,
  MATERIAL_OPTIONS
} from "@/components/configurator/configurator-data";

type ConfiguratorState = {
  selectedColorId: string;
  selectedMaterialId: string;
  selectedEnvironmentId: string;
  hotspotsVisible: boolean;
  hasHydrated: boolean;
  setColorVariant: (id: string) => void;
  setMaterial: (id: string) => void;
  setEnvironment: (id: string) => void;
  toggleHotspots: () => void;
  markHydrated: () => void;
};

const storage: StateStorage | undefined =
  typeof window !== "undefined"
    ? createJSONStorage(() => window.localStorage)
    : undefined;

const defaultState = {
  selectedColorId: COLOR_VARIANTS[0]?.id ?? "aurora",
  selectedMaterialId: MATERIAL_OPTIONS[0]?.id ?? "knit-fabric",
  selectedEnvironmentId: ENVIRONMENT_OPTIONS[0]?.id ?? "studio",
  hotspotsVisible: true,
  hasHydrated: typeof window === "undefined"
};

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set) => ({
      ...defaultState,
      setColorVariant: (id) => set({ selectedColorId: id }),
      setMaterial: (id) => set({ selectedMaterialId: id }),
      setEnvironment: (id) => set({ selectedEnvironmentId: id }),
      toggleHotspots: () =>
        set((state) => ({ hotspotsVisible: !state.hotspotsVisible })),
      markHydrated: () => set({ hasHydrated: true })
    }),
    {
      name: "shoe-configurator-state",
      skipHydration: true,
      partialize: (state) => ({
        selectedColorId: state.selectedColorId,
        selectedMaterialId: state.selectedMaterialId,
        selectedEnvironmentId: state.selectedEnvironmentId,
        hotspotsVisible: state.hotspotsVisible
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
      ...(storage ? { storage } : {})
    }
  )
);
