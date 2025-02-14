<template>
    <header>
        <h1>
            <router-link to="/" class="logo">
                <img alt="Vue logo" src="../assets/mefit.png" width="130" />
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
    background-color: #ffffff;
    padding: 15px 40px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    color: #333;
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

/* 햄버거 버튼 (기본: 숨김) */
.hamburger-menu {
    display: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
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
        width: 160px;
        background: white;
        border: 1px solid #ddd;
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
        padding: 5px;
        font-size: 14px;
        color: #333;
        text-decoration: none;
    }

    .menu a.router-link-active {
        background-color: #007bff;
        color: white;
        font-weight: bold;
        border-radius: 5px;
    }
}
</style>
