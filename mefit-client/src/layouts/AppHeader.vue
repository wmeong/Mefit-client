<template>
  <header>
    <h1><a href="#" class="logo"><img alt="Vue logo" src="../assets/logo.png" width="130"></a></h1>
    <div class="menuWrap">
      <ul class="menu">
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/characterinfo">캐릭터정보</router-link></li>
        <li><router-link to="/ranking">랭킹</router-link></li>
        <li><router-link to="/codisimulation">코디시뮬</router-link></li>
        <li><router-link to="/royal-simulation">로얄스타일</router-link></li> <!-- 새로운 메뉴 추가 -->
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader"
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff; /* 배경을 흰색으로 변경 */
  padding: 15px 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header h1 {
  margin: 0;
}

header h1 .logo img {
  width: 130px;
}

.menuWrap {
  display: flex;
  align-items: center;
}

.menu {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  position: relative;
}

.menu a {
  text-decoration: none;
  color: #333; /* 글자색을 진한 회색으로 */
  font-weight: bold;
  font-size: 16px;
  padding: 10px 15px;
  transition: background-color 0.3s ease, color 0.3s ease;
  border-radius: 5px;
}

.menu a:hover {
  background-color: #f0f0f0; /* 호버 시 밝은 회색 배경 */
  color: #333;
}

/* 모바일 환경을 위한 스타일 */
@media (max-width: 768px) {
  header {
    flex-direction: column;
    padding: 20px;
  }

  header h1 {
    margin-bottom: 15px;
  }

  .menuWrap {
    width: 100%;
    justify-content: center;
  }

  .menu {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
