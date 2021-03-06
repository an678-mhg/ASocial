import create from "zustand";

const useStore = create((set) => ({
  curentUser: undefined,
  setUser: (newUser) =>
    set({
      curentUser: newUser,
    }),
}));

export default useStore;
