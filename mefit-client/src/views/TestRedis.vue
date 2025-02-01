<template>
    <div class="test-redis">
        <h2>Redis API 테스트</h2>
        <button @click="testRedisApi">API 호출</button>
        <p v-if="responseMessage">{{ responseMessage }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'TestRedis',
    data() {
        return {
            responseMessage: '' // API 응답 메시지를 저장할 변수
        };
    },
    methods: {
        async testRedisApi() {
            try {
                // 백엔드 API 호출
                const response = await axios.get('http://localhost:8081/test-redis');
                this.responseMessage = response.data;
            } catch (error) {
                console.error('API 호출 오류:', error);
                this.responseMessage = 'API 호출 실패';
            }
        }
    }
};
</script>

<style scoped>
.test-redis {
    text-align: center;
    margin-top: 20px;
}

button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

button:hover {
    background-color: #45a049;
}

p {
    margin-top: 20px;
    font-weight: bold;
}
</style>
