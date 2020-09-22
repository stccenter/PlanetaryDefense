import Cookies from 'js-cookie'

const state = {
  sidebar: {
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  params: {text: '', type: '1', start: '', end: ''}
}

const mutations = {
  // TOGGLE_SIDEBAR: state => {
  //   state.sidebar.opened = !state.sidebar.opened
  //   state.sidebar.withoutAnimation = false
  //   if (state.sidebar.opened) {
  //     Cookies.set('sidebarStatus', 1)
  //   } else {
  //     Cookies.set('sidebarStatus', 0)
  //   }
  // },
  // CLOSE_SIDEBAR: (state, withoutAnimation) => {
  //   Cookies.set('sidebarStatus', 0)
  //   state.sidebar.opened = false
  //   state.sidebar.withoutAnimation = withoutAnimation
  // },
  SET_PARAMS: (state, params) => {
    state.params = params
  },

  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  // toggleSideBar({ commit }) {
  //   commit('TOGGLE_SIDEBAR')
  // },
  // closeSideBar({ commit }, { withoutAnimation }) {
  //   commit('CLOSE_SIDEBAR', withoutAnimation)
  // },
  setParams({ commit }, params){
    commit('SET_PARAMS', params)
  },

  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
