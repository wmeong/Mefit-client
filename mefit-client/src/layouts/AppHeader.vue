<template>
  <header>
    <h1><a href="#" class="logo"><img alt="Vue logo" src="../assets/logo.png" width="130"></a></h1>
    <div class="menuWrap">
      <ul class="menu">
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/characterinfo">캐릭터정보</router-link></li>
        <li><router-link to="/ranking">랭킹</router-link></li>
        <li><router-link to="/codisimulation">코디시뮬</router-link></li>
        <li><router-link to="/market">경매장</router-link></li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader"
}
</script>

<style scoped>
header {
  width: 100%;
  text-align: center;
  position: relative;
  height: 120px;
  border-bottom: 1px solid #35495e;
  padding-top: 50px;
}

header h1 {
  position: absolute;
  top: 20px;
  left: 20px;
}

.menuWrap {
  display: flex;
  justify-content: flex-end;
  margin-right: 20px;
}

header ul.menu {
  display: flex;
  gap: 10px;
}

header ul.menu li {
  list-style: none;
}

@media (max-width: 768px) {
  header {
    height: auto;
    padding: 10px;
  }

  header h1 {
    position: static;
    margin-bottom: 10px;
  }

  .menuWrap {
    flex-direction: column;
    align-items: center;
  }

  header ul.menu {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
