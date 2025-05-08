<template>
  <div class="readMore">
    <div v-html="formattedString"></div>
    <div class="readMore-action" v-if="text.length > maxChars">
      <a :href="link" id="readmore" v-if="!isReadMore" @click.prevent="triggerReadMore($event, true)">{{ moreStr }}</a>
      <a :href="link" id="readmore" v-if="isReadMore" @click.prevent="triggerReadMore($event, false)">{{ lessStr }}</a>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';

// 定义 props
const props = defineProps({
  moreStr: {
    type: String,
    default: 'read more'
  },
  lessStr: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '#'
  },
  maxChars: {
    type: Number,
    default: 100
  }
});

// 定义响应式变量
const isReadMore = ref(false);

// 计算属性，根据是否展开显示不同的文本
const formattedString = computed(() => {
  let valContainer = props.text;
  if (!isReadMore.value && props.text.length > props.maxChars) {
    valContainer = valContainer.substring(0, props.maxChars) + '...';
  }
  return valContainer;
});

// 处理阅读更多和收起的点击事件
const triggerReadMore = (event, shouldExpand) => {
  if (props.link === '#') {
    event.preventDefault();
  }
  if (props.lessStr) {
    isReadMore.value = shouldExpand;
  }
};
</script>
<style lang="scss" scoped>
.readMore {
  padding: 6px 0;
  &-action {
    text-align: right;
  }
}
</style>
