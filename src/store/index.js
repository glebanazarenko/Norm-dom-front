import { createStore } from "vuex";

import notes from './modules/notes';
import users from './modules/users';
import houses from './modules/houses';

export default createStore({
  modules: {
    notes,
    users,
    houses,
  }
});