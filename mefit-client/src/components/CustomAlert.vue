<template>
  <div class="custom-alert" v-if="visible">
    <div class="custom-alert-content">
      <h3 class="custom-alert-title">{{ title }}</h3>
      <p class="custom-alert-message">{{ message }}</p>
      <!-- 확인 버튼 클릭 시 'confirm' 이벤트 발생 -->
      <v-btn @click="confirmAlert" color="pink" class="custom-alert-button">확인</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "알림",
    },
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeAlert() {
      this.$emit("close"); // 팝업 닫기 이벤트 발생
    },
    confirmAlert() {
      this.$emit("confirm"); // ✅ 'confirm' 이벤트 발생
      this.closeAlert(); // 팝업 닫기
    },
  },
};
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-alert-content {
  background-color: #fff;
  width: 360px;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

.custom-alert-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.custom-alert-message {
  font-size: 13px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.4;
}

.custom-alert-button {
  font-size: 12px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s;
}
</style>
