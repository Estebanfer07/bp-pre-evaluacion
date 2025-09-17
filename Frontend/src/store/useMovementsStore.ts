import { create } from "zustand";

export interface MovementsState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useMovementsStore = create<MovementsState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}));
