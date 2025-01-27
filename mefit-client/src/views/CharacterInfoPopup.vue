<template>
  <v-dialog 
    v-model="visible" 
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{ character.name }}의 코디</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4">
              <img :src="character.image" alt="Character" class="character-img" />
            </v-col>
            <v-col cols="8">
              <h4>착용 아이템</h4>
              <v-list>
                <v-list-item
                  v-for="(item, index) in character.items"
                  :key="index"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.details }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="visible = false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    character: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:modelValue'], // 부모와의 데이터 동기화
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>
