<template>
  <!-- <el-container class="home">
    <el-header style="padding: 0px;">
    <el-menu
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
    >
      <li> 低幼小程序</li>
      <el-menu-item :index="item.path" v-for="item in menulist" :key="item.path" style="padding:0,30px,0,30px">{{ item.name }}</el-menu-item>
    </el-menu>
    </el-header>
    <el-main><router-view></router-view></el-main>
  </el-container>-->
  <el-container class="home">
    <div class="common-menu">
      <div class="common-menu__banner banner">
        <div
          @click="isCollapse = !isCollapse"
          :class="[
          'banner__btn',
          isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'
        ]"
        ></div>
      </div>
      <div class="common-menu__body">
        <el-menu router unique-opened :default-active="$route.path" :collapse="isCollapse">
          <!-- <template v-for="menuItem in menuList"> -->
          <!-- <el-submenu
              v-if="menuItem.childrenPage"
              :key="menuItem.frontRouterUrl"
              :index="menuItem.frontRouterUrl"
            >
              <template slot="title">
                <i :class="iconMap.get(menuItem.frontRouterUrl) || ''"></i>
                <span slot="title">{{ menuItem.menuName }}</span>
              </template>
              <el-menu-item
                v-for="childItem in menuItem.childrenPage"
                :key="childItem.frontRouterUrl"
                :index="`/${childItem.frontRouterUrl}`"
              >{{ childItem.menuName }}</el-menu-item>
          </el-submenu>-->
          <el-menu-item :key="menuItem.path" :index="menuItem.path" v-for="menuItem in menuList">
            <!-- <i :class="el-icon-document"></i> -->
            <span slot="title">{{ menuItem.name }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <el-container>
    <el-header class="header">Header</el-header>
    <el-main class="main-right page_main">
      <transition name="fade-transform" mode="out-in">
          <!-- <keep-alive :include="currentInclude"> -->
        <router-view />
          <!-- </keep-alive> -->
      </transition>
    </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { children } from "@/router/index";

export default {
  name: "App",
  data () {
    return {
      menuList: children,
      isCollapse: false
    };
  },
  created () {
    console.log(this.$router.currentRoute);
  }
};
</script>

<style lang="less" scoped>
.common-menu {
  flex-shrink: 0;
  // width: 160px;
  width: 210px;
  height: 100%;
  background-color: #2e384d;
}
.common-menu__banner {
  position: relative;
  height: 50px;
  background: url("~@/assets/imgs/logo.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;
}
.banner__btn {
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  cursor: pointer;
}
.common-menu__body {
  height: calc(100vh - 50px);
  padding: 0 8px;
  overflow: auto;
}
/deep/ .el-menu {
  background-color: inherit;
  border-right: none;
  .el-submenu + .el-submenu,
  .el-menu-item + .el-menu-item,
  .el-submenu + .el-menu-item,
  .el-menu-item + .el-submenu,
  .el-submenu > .el-menu > .el-menu-item:first-child {
    margin-top: 4px;
  }
  .el-menu-item,
  .el-submenu__title {
    position: relative;
    min-width: 0;
    height: 40px;
    line-height: 40px;
    padding: 0 0 0 40px !important;
    font-size: 12px;
    color: #999;
    &:hover {
      border-radius: 2px;
      background-color: #434c5f;
    }
    [class^="el-icon-"] {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .el-menu-item.is-active {
    border-radius: 2px;
    color: #fff;
    background-color: #24b366;
  }
  .el-submenu.is-active .el-submenu__title {
    border-radius: 2px;
    background-color: #434c5f;
  }
}
.common-menu--collapse {
  width: auto;
  .common-menu__body {
    padding: 0;
  }
  /deep/ .el-menu {
    .el-menu-item,
    .el-submenu__title {
      padding: 0 20px !important;
      [class^="el-icon-"] {
        position: static;
        transform: none;
      }
    }
  }
}
.home {
  width: 100%;
  height: 100%;
  background: #fff;
  .main-right {
    position: relative;
    background-color: #F3F3F7;
  }
  .header {
    height: 50px !important;
    box-shadow: 0px 1px 0px 0px rgba(240, 241, 245, 1);
    // box-shadow: 0 1px 6px 0 hsla(0, 0%, 80%, 0.5);
  }
}
</style>
