import { computed } from 'vue'

export default function useSearchFieldVisibility(searchFields) {
  const handleFieldShow = (field) => {
    return searchFields.value.includes(field)
  }

  return {
    handleFieldShow
  }
}
