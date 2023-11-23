// store in a separate module to avoid dependecy/require cycle warning

let registeredStore;

export default {
  register: store => (registeredStore = store),
  getStore: () => registeredStore,
};
