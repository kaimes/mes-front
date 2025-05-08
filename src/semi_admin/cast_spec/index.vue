<template>
    <v-container class="page" fluid>
      <v-form ref="searchForm" @submit.prevent="handleSearch" @keydown.enter="handleSearch">
        <v-row align="center">
          <v-col cols="2">
            <CastCode
              v-model="cast_code"
              label="Cast Code"
              :hide-details="true"
              @change="handlePickCastCode"
            />
          </v-col>
          <v-col cols="2">
            <SpecCode
              v-model="spec_code"
              label="Spec Code"
              :hide-details="true"
              @change="handlePickSpecCode"
            />
          </v-col>
          <v-col cols="2">
            <ProductSizeCode 
              v-model="product_size" 
              :hide-details="true" 
              label="Product Size Code"
              @change="handlePickProductSizeCode"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
                v-model="queryParams.q"
                label="Search by Cast Code or Spec Code "
                clearable
                hide-details
            ></v-text-field>
            
            
          </v-col>
          <v-col cols="3">
            <v-btn
                class="text-none ml-4"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
            {{ $t('global.reset') }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none ml-4 mr-4 my-1"
                color="primary"
                variant="flat"
                :loading="loading"
            >
            {{ $t('global.search') }}
            </v-btn>
          </v-col>
                        
        </v-row>
      </v-form>
      <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
        <v-data-table-server
            fixed-header
            height="650"
            show-current-page
            min-height="300"
            items-per-page="10"
            :page="queryParams.page"
            :headers="tableHeaders"
            :items="tableList"
            :items-length="total"
            :loading="loading"
            item-value="id"
            @update:page="handleTableChange"
            @update:itemsPerPage="handleTableChangeItemsPerChange"
            @update:sortBy="handleTableChangeSortBy"
        >
        <template v-slot:item.cast_code="{ item }">
            {{ item.cast_code }}
        </template>

        <template v-slot:item.spec_code="{ item }">
            {{ item.spec_code }}
        </template>

        <template v-slot:item.product_category="{ item }">
            {{ item.product_category }}
        </template>

        <template v-slot:item.weights="{ item }">
            {{ item.weights }}
        </template>

        <template v-slot:item.semi_size="{ item }">
          {{ item.semi_size }}
        </template>

        <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
        </template>
        </v-data-table-server>
      </v-card>
    </v-container>
  </template>
  <script name="SemiCastSpec" setup>
  import {useRoute} from "vue-router";
  import {getCurrentInstance, inject, reactive, ref, toRaw, toRefs, computed} from "vue";
  import {toast} from "vue3-toastify";
  import API from "./api";
  import CastCode from "@/components/picker/CastCode.vue";
  import SpecCode from "@/components/picker/SpecCode.vue";
  import ProductSizeCode from "@/components/picker/ProductSizeCode.vue";
  import { useI18n } from "vue-i18n";
  const { t } = useI18n()
  
  const route = useRoute();
  const snackbar = inject('snackbar');
  const {proxy} = getCurrentInstance();
  const loading = ref(false);

  const tableHeadersDefinition = ref([
    {title: "cast_spec.table.cast_code", key: "cast_code", fixed: true, width: 150, minWidth: 150},
    {title: "cast_spec.table.spec_code", key: "spec_code", fixed: true, width: 150, minWidth: 150},
    {title: "cast_spec.table.product_size", key: "product_category", fixed: true, width: 150, minWidth: 150},
    {title: "cast_spec.table.weight_kg", key: "weights", fixed: true, width: 150, minWidth: 150},
    {title: "cast_spec.table.semi_size", key: "semi_size", fixed: true, width: 150, minWidth: 150, sortable: false},
  ]);
  const tableHeaders = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });
  const tableList = ref([]);
  const total = ref(0);
  
  const data = reactive({
    queryParams: {
      q: undefined,
      page: 1,
      itemsPerPage: 10,
      sortBy: ["created_at"],
      descending: [true],
    },
    cast_code: null,
    spec_code: null,
    product_type_id: null,
    product_size: null
  });
  
  const {
    queryParams, 
    cast_code,
    spec_code,
    product_type_id,
    product_size
  
  } = toRefs(data);
  
  
  
  const truncateProductCategory = (category) => {
    if (!category) return category;
    const parts = category.split("-");
    if (parts.length > 2) {
        return parts.slice(0, -1).join("-"); // Remove the last part
    }
    return category;
    };

    const groupTableData = (items, itemsPerPage, extraItems) => {
      const groupedData = {};
      const extraRows = []; // Store items beyond the first `itemsPerPage`

      // Group items
      items.forEach((item, index) => {
        if (index >= itemsPerPage) {
          extraRows.push(item); // Collect items for extra rows
          return;
        }

        const truncatedCategory = truncateProductCategory(item.product_type?.code || "Unknown");
        const key = `${item.cast?.cast_code || "N/A"}-${item.spec?.spec_code || "N/A"}-${truncatedCategory}`;

        if (!groupedData[key]) {
          groupedData[key] = {
            cast_code: item.cast?.cast_code || "N/A",
            spec_code: item.spec?.spec_code || "N/A",
            product_category: truncatedCategory,
            weights: [],
            semi_size: "", // Default if no semi size
          };
        }

        // Add weights
        if (item.product_type?.dim3) {
          groupedData[key].weights.push(item.product_type.dim3);
        }

        // Find the best-ranked semi size
        if (item.alt_semi_sizes && item.alt_semi_sizes.length > 0) {
          const sortedSizes = item.alt_semi_sizes.sort((a, b) => a.rank_seq - b.rank_seq);
          const bestSemi = sortedSizes[0]; // Pick the first (highest rank)
          if (bestSemi && bestSemi.semi_size) {
            const thickmm = bestSemi.semi_size.thick_mm || "N/A";
            const widthmm = bestSemi.semi_size.width_mm || "N/A";
            groupedData[key].semi_size = `${widthmm} x ${thickmm}`;
          }
        }
      });

      // Convert grouped data back to array format
      let groupedArray = Object.values(groupedData).map((group) => ({
        cast_code: group.cast_code,
        spec_code: group.spec_code,
        product_category: group.product_category,
        weights: group.weights.join(", "),
        semi_size: group.semi_size,
      }));

      // Fill empty rows with extra items
      while (groupedArray.length < itemsPerPage && extraRows.length > 0) {
        const extraItem = extraRows.shift(); // Take from extra rows
        groupedArray.push({
          cast_code: extraItem.cast?.cast_code || "N/A",
          spec_code: extraItem.spec?.spec_code || "N/A",
          product_category: truncateProductCategory(extraItem.product_type?.code || "Unknown"),
          weights: extraItem.product_type?.dim3 || "N/A",
          semi_size: "N/A", // Fallback if no semi size
        });
      }

      return groupedArray;
    };

  const getData = () => {
    const params = {
    ...toRaw(queryParams.value), // Include q, page, itemsPerPage, sortBy, and descending
    fields: [],
    ops: [],
    values: [],
  };

    // Apply Cast Code filter
    if (cast_code.value) {
      params.fields.push("cast.cast_code");
      params.ops.push("==");
      params.values.push(cast_code.value);
    }
    if (spec_code.value) {
      params.fields.push("spec.spec_code");
      params.ops.push("==");
      params.values.push(spec_code.value);
    }
    if (product_type_id.value) {
      params.fields.push("product_type_id");
      params.ops.push("==");
      params.values.push(product_type_id.value);
    }
    if (product_size.value) {
      params.fields.push("product_type.code");
      params.ops.push("like");
      params.values.push(`${product_size.value}%`);
    }
    // Handle additional query (e.g., full-text search)
  if (params.q) {
    params.fields.push("q");
    params.ops.push("contains");
    params.values.push(params.q);
  }
    loading.value = true;
    API.getCastDetail(params)
        .then((res) => {
        if (res.status === 200) {
            total.value = res.data.total || 0;
            // Apply grouping and truncation
            tableList.value = groupTableData(res.data.items) || [];
        } else {
            total.value = 0;
            tableList.value = [];
        }
        })
        .finally(() => {
        loading.value = false;
        });
    };

  const handlePickCastCode = (cast) => {
    data.cast_code = cast?.cast_code || null;
};
  const handlePickSpecCode = (spec) => {
      data.spec_code = spec?.spec_code || null;
  };
  const handlePickProductSizeCode = (product_size) => {
    data.product_size = product_size?.code || null;
  };
  const handleTableChangeItemsPerChange =(itemsPerPage)=>{
  queryParams.value.itemsPerPage = itemsPerPage;
  getData();
}

const handleTableChangeSortBy = (sortBy)=>{
  queryParams.value.sortBy = sortBy;
  getData();
}

const handleTableChange = (page) => {
  queryParams.value.page = page;
  getData();
}
  
  const handleSearch = () => {
    queryParams.value.page = 1;
    getData();
  }
  
  const handleReset = () => {
    queryParams.value.q = null;

    // Reset pagination
    queryParams.value.page = 1;
    proxy.$refs["searchForm"].reset();
    handleSearch();
  }
  
  // 创建新数据
  const handleEdit = (data) => {
    proxy.$refs["editFormRef"].handleShow(data);
  }
  
  const handleDelete = (isActive, row) => {
    isActive.value = false;
    API.remove(row.id).then(() => {
      toast.success("Delete Success", {
        position: "bottom-center"
      });
      getData();
    });
  }
  

  getData();
  </script>
  <style lang="scss" scoped>
  .page {
    .section-field {
      display: flex;
      flex-direction: row;
      align-items: center;
  
      &-input {
        flex: 1;
        flex-shrink: 0;
      }
  
      &-divider {
        width: 20px;
        height: 2px;
        background-color: #333;
        margin: 0 10px;
      }
    }
  }
  </style>
