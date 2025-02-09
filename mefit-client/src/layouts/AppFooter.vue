<template>
  <footer>
    <div class="footer-content">
      <span>
        Copyright 2025. Mefit. 🌈메애기의 컬러를 찾아드립니다.
        <br />Developed by 엘리시움@젠득 & 엘리시움@우멍 💖
      </span>
      <div class="button-icon-group">
        <v-btn class="donate-btn" color="primary" @click="toggleAccount">문의&후원💰</v-btn>
        <div v-if="showAccount" class="icon-group">
          <a href="https://www.youtube.com/@wmeong" target="_blank">
            <img src="@/assets/youtube.png" width="24" height="24" alt="YouTube" class="icon" />
          </a>
          <a href="https://www.instagram.com/ziho_ya?igsh=MTZxZmZldnNwZWMycA==" target="_blank">
            <img src="@/assets/insta.png" width="24" alt="Instagram" class="icon" />
          </a>
        </div>
      </div>
      <br />Data powered by NEXON OPEN API
      <br />This is an independent project not associated with NEXON Korea.
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
  data() {
    return {
      showAccount: false // 계좌번호 표시 여부
    };
  },
  methods: {
    toggleAccount() {
      this.showAccount = !this.showAccount; // 버튼 클릭 시 토글
    }
  }
};
</script>

<style scoped>
footer {
  border-top: 2px solid #d3d3d3;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 12px;
  color: #1a191a75;
  margin: 50px 0 0 0;
  padding: 20px 0;
  background-color: #fafafa;
}
.footer-content {
  text-align: center;
}

.button-icon-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;

}

.icon-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-left: 12px;
}


.icon {
  width: auto; 
  max-width: 24px;
  max-height: 24px;
  height: auto;
  border-radius: 0; 
}



.donate-btn {
  font-size: 11px;
  margin-left: 5px;
  padding: 4px 8px;
  color: #ffffff !important;
  background-color: #eca8a8 !important;
  border-radius: 16px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  transition: background-color 0.3s ease;
}

.donate-btn:hover {
  background-color: #feb4b4 !important;
}


@media (max-width: 768px) {
  footer {
    font-size: 12px;
    margin: 10px 0 0 0;
    padding: 5px 0;
  }
  .donate-btn {
    font-size: 10px;
    padding: 2px 4px;
  }
  .account-info {
    font-size: 10px;
  }
}
</style>
