<template>
    <header>
        <h1>
            <router-link to="/" class="logo">
                <img alt="Vue logo" src="../assets/mefit.webp" width="130" />
            </router-link>
        </h1>

        <!-- 햄버거 버튼 (모바일) -->
        <div class="hamburger-menu" @click="toggleMenu">
            {{ isMenuOpen ? "✖" : "☰" }}
        </div>

        <div :class="['menuWrap', { 'menu-open': isMenuOpen }]">
            <ul class="menu">
                <li @click="closeMenu">
                    <router-link to="/">홈</router-link>
                </li>
                <li @click="closeMenu">
                    <router-link to="/characterinfo">캐릭터정보</router-link>
                </li>
                <li @click="closeMenu">
                    <router-link to="/personalcolor-select"
                        >퍼스널컬러</router-link
                    >
                </li>
                <li @click="closeMenu">
                    <router-link to="/colorAwards">컬러어워즈</router-link>
                </li>
                <li @click="closeMenu">
                    <router-link to="/color-pick">컬러픽</router-link>
                </li>
                <li @click="closeMenu">
                    <router-link to="/royal-simulation">로얄스타일</router-link>
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
            isMenuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        },
    },
};
</script>

<style>
/* 기존 스타일 유지 */
header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F5EAFD; /* 부드러운 연보라 */
    padding: 15px 40px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08); /* 그림자 약하게 */
    transition: background-color 0.3s ease-in-out;
}

header h1 {
    margin: 0;
    display: flex;
    align-items: center;
}

header h1 .logo img {
    margin-top: 10px;
    width: 130px;
    margin-right: 230px;
}

.menuWrap {
    display: flex;
    align-items: center;
    gap: 30px;
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
    color: #4A3F65; /* 짙은 연보라 */
    font-weight: bold;
    font-size: 16px;
    padding: 10px 15px;
    transition: all 0.3s ease;
    border-radius: 5px;
}

.menu a:hover {
    background-color: #A2E4D9; /* 트렌디한 민트 */
    color: #3B2E5A; /* 진한 보라 */
    font-weight: bold;
}

/* 햄버거 버튼 (기본: 숨김) */
.hamburger-menu {
    display: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    color: #4A3F65; /* 짙은 연보라 */
}


/* 모바일에서 햄버거 버튼 활성화 */
@media (max-width: 768px) {
    .hamburger-menu {
        display: block;
        position: absolute;
        right: 20px;
        top: 20px;
    }

    .menuWrap {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 60px;
        right: 0;
        width: 180px;
        background: #FAF3FF; /* 연보라 계열 */
        border: 1px solid #E0C7FF; /* 살짝 더 진한 연보라 */
        z-index: 100;
        border-radius: 10px;
        padding: 10px;
    }

    .menuWrap.menu-open {
        display: flex;
    }

    .menu {
        flex-direction: column;
        gap: 10px;
        padding: 10px 0;
        list-style: none;
        text-align: center;
    }

    .menu li {
        padding: 10px 0;
    }

    .menu a {
        display: block;
        padding: 6px;
        font-size: 15px;
        color: #4A3F65;
        text-decoration: none;
        border-radius: 5px;
        transition: 0.3s;
    }

    .menu a.router-link-active {
    background-color: #D6B4FC !important; /* 기존 하늘색 → 연보라 */
    color: #ffffff !important; /* 텍스트 색상을 흰색으로 */
    font-weight: bold;
    border-radius: 5px;
    padding: 10px 15px;
    transition: all 0.3s ease-in-out;
    }
}
</style>
