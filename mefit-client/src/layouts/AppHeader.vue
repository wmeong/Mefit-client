<template>
    <header>
        <h1>
            <router-link to="/" class="logo">
                <img alt="Vue logo" src="../assets/mefit.png" width="130" />
            </router-link>
        </h1>
        <div class="menuWrap">
            <ul class="menu">
                <li>
                    <router-link to="/">홈</router-link>
                </li>
                <li>
                    <router-link to="/characterinfo">캐릭터정보</router-link>
                </li>
                <li>
                    <router-link to="/personalcolor-select"
                        >퍼스널컬러</router-link
                    >
                </li>
                <li>
                    <router-link to="/colorAwards">컬러어워즈</router-link>
                </li>
                <li>
                    <router-link to="/color-pick">컬러픽</router-link>
                </li>
                <li>
                    <router-link to="/royal-simulation">로얄스타일</router-link>
                </li>
                <li>
                    <router-link to="/personal-colorTest"
                        >퍼스널테스트</router-link
                    >
                </li>
            </ul>
        </div>
    </header>
</template>

<script>
export default {
    name: "AppHeader",
    data() {
        return {
            isDarkMode: false, // 초기 모드는 라이트 모드
        };
    },
    methods: {},
};
</script>

<style>
header {
    display: flex;
    align-items: center;
    justify-content: center; /* 로고와 메뉴를 전체 가운데 정렬 */
    background-color: #ffffff;
    padding: 15px 40px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header h1 {
    margin: 0;
    display: flex;
    align-items: center;
}
/*로고*/
header h1 .logo img {
    width: 130px;
    margin-right: 130px;
}

.menuWrap {
    display: flex;
    align-items: center;
    gap: 30px; /* 로고와 메뉴 사이 간격 */
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
    background-color: #f0f0f0;
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
    /* 활성 메뉴 스타일 추가 */
    .menu a.router-link-active {
        background-color: #007bff;
        color: white;
        font-weight: bold;
    }
}
</style>
