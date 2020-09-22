<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route,index) in routes"
          :key="index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
// import { requestData } from "@/api/result";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      // console.log(this.$store.getters.params.text)
      // if (this.$store.getters.params.text == "") {
      //   return this.$router.options.routes.concat({
      //     path: "*",
      //     redirect: "/404",
      //     hidden: true
      //   });
      // } else {
      //   return this.$router.options.routes.concat(
      //     {
      //       path: "/foundReference",
      //       component: Layout,
      //       children: [
      //         {
      //           path: "foundReference",
      //           name: "foundReference",
      //           component: () => import("@/views/found-reference"),
      //           meta: { title: "Found References" }
      //         }
      //       ]
      //     },
      //     { path: "*", redirect: "/404", hidden: true }
      //   );
      // }
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      // console.log(this.sidebar)
      return !this.sidebar.opened;
    }
  }
};
</script>
