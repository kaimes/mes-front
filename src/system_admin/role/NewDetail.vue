<template>
  <v-card>
    <v-toolbar
      color="surface-light"
      density="compact"
      title="Local hotspots"
      flat
    ></v-toolbar>
    <v-spacer></v-spacer>
    <v-row class="d-flex align-center ga-4">
      <v-col cols="3">
        <v-text-field
          v-model="searchQuery"
          label="Search"
          hide-details
          clearable
          @input="onSearchInput"
          variant="underlined"
          prepend-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <div class="d-flex ga-4 align-center">
          <v-btn class="text-none" color="#e3e3e3" variant="flat" @click="handleReset">
            Reset
          </v-btn>
          <v-btn type="submit" class="text-none" color="primary" variant="flat" :loading="loading" @click="onSearchInput">
            Search
          </v-btn>
          <!-- <v-btn class="text-none" color="surface-light" variant="flat" @click="resetSelection">
            Reset
          </v-btn> -->
          <v-btn type="submit" class="text-none" color="primary" variant="flat" style="min-width: 80px" @click="save">
            Save
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col class="d-flex align-center" cols="12" sm="6">
        <v-treeview
          v-model:selected="treesR"
          :activated="activeNode"
          :opened="open"
          :items="filteredItems"
          class="flex-1-0"
          :load-children="onNodeSelectionChange"
          @update:selected="handleLeftTreeSelection"
          density="compact"
          item-title="title"
          item-value="id"
          select-strategy="independent"

          activatable
          selectable
          open-on-click
          style="max-height: 400px; overflow-y: auto;"

        > 
        </v-treeview>

      </v-col>

      <v-divider :vertical="$vuetify.display.mdAndUp" class="my-md-3"></v-divider>

      <v-col cols="12" sm="6">
        <v-card-text>
          <div
            v-if="buttonItems.length === 0"
            class="text-h6 font-weight-light text-grey pa-4 text-center"
          >
          Please select the second-level node in the right sidebar
          </div>

          <div class="d-flex flex-wrap ga-1">
            <v-treeview
              v-model:selected="tree"
              :items="buttonItems"
              class="flex-1-0"
              item-title="title"
              item-value="id"
              select-strategy="classic"
              return-object
              selectable
              style="max-height: 400px; overflow-y: auto;"
            ></v-treeview>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, toRaw, reactive, computed ,shallowRef} from 'vue'
import { useRoleStore } from './storePinia';
import { useRoute } from 'vue-router';
import {toast} from "vue3-toastify";
import Api from './api';
import { filter } from 'xe-utils';
import { tr } from 'date-fns/locale';

const RoleApi = useRoleStore();
const tree = ref([]);  
const treesR = ref([]);  
const activeNode = ref([]);
const items = ref([]);  
const route = useRoute();
const searchQuery = ref('');
const filteredItems = ref([]);
const open = ref([]);
const buttonItems = ref([]);
const selectedData = ref({});
const rawData = ref([]);
const previousSelectionValue = ref([]);
const deleteButton = ref([]);

const id = route.query.id;
let previousSelection = [];

onMounted(() => {
  roleData(id)
  loadTreeData(id); 
});

watch(tree, (newSelection) => {
  let newSelectionCopy = [...newSelection];
  newSelection.forEach(item => {
    if (item.checkbox === 'checked') {
      selectAllChildren(item, newSelectionCopy);
    }
  });

  const updated = newSelection.some(item => {
    const originalNode = tree.value.find(node => node.id === item.id);
    
    if (!originalNode || !originalNode.checkbox) return false;

    return originalNode.checkbox.state !== item.checkbox.state;
  });

  if (updated) {
    setTimeout(() => {
      tree.value = newSelectionCopy;
    }, 0);
  }
}, { deep: true });

let selectedQuantity = new Set();

const handleLeftTreeSelection = (newSelection) => {
  buttonItems.value = []
  const newSelectionCount = newSelection.length;
  const selectedQuantityCount = selectedQuantity.size;
  const initiallyCount = initially.value.length;
  if (newSelectionCount < initiallyCount) {
    const missingNodeId = initially.value.find(id => !newSelection.includes(id));
    if (missingNodeId) {
      const matchedNode = findNodeById(rawData.value, missingNodeId);
      if (matchedNode && matchedNode.children) {
        matchedNode.children.forEach(child => {
          if (child.type === 'button') {
            child.checkbox == null
            const buttonId = child.id
            deleteButton.value.push(child)
            removeNodeById(tree.value, buttonId)
          }
        });
        // onNodeSelectionChange(matchedNode)
        deleteButton.value = []
      }
    }
  }

  if (newSelectionCount < selectedQuantityCount) {
    const lastSelectedNode = [...selectedQuantity].pop();
    const matchedNode = findNodeById(rawData.value, lastSelectedNode);
    const selectedQuantityCount = selectedQuantity.size - 1
    if (matchedNode && matchedNode.children) {
      matchedNode.children.forEach(child => {
        if (child.type === 'button') {
          child.checkbox == null
          const buttonId = child.id
          deleteButton.value.push(child)
          removeNodeById(tree.value, buttonId)
        }
      });
      // onNodeSelectionChange(matchedNode)
      deleteButton.value = []
    }
  }else{
    newSelection.forEach(node => {
      selectedQuantity.add(node); 
  });

  const lastNode = newSelection[newSelection.length - 1];
  const matchedNode = findNodeById(rawData.value, lastNode);
  if (matchedNode && matchedNode.children) {
    matchedNode.children.forEach(child => {
      if (child.type === 'button' && child.checkbox === null) {
        child.checkbox = { state: 'checked' };
        buttonItems.value.push(child);
      } else {
        buttonItems.value.push(child);
      }
    });
  }
  onNodeSelectionChange(matchedNode)
  }

};

const removeNodeById = (nodes, id) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id) {
      nodes.splice(i, 1); 
      const rawNode = deleteFindNodeById(rawData.value, id);
      if (rawNode) {
        rawNode.checkbox = null;  
      }
      return true;
    }
  }
  nodes = nodes.filter(item => item !== undefined);
  return nodes;
};

const deleteFindNodeById = (nodes, id) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id && node.type == "button") {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = deleteFindNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findNodeById = (nodes, id) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === id && node.children && node.children.length > 0) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

function findNodeByIdAndTitle(nodes, id, title) {
  for (let node of nodes) {
    if (node.id === id && node.title === title) {
      return node;
    }

    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      const childNode = findNodeByIdAndTitle(node.children, id, title);
      if (childNode) {
        return childNode;
      }
    }
  }
  return null;
}

const initially = ref([])

function loadTreeData(id) {
  Api.getMenuTreeSelect(id)
    .then((response) => {
      const data = response.data.options;
      items.value = processMenuData(data);
      rawData.value = response.data.options;
      // buttonItems.value = getButtonItems(items.value);
      tree.value = getPreselectedNodes(items.value); 
      treesR.value = getPreselectedNodesForNonButton(rawData.value);
      filteredItems.value = filterUncheckedNodes(items.value);
      initially.value = treesR.value
    })
    .catch((err) => {
        console.log("Failed to load menu data:", err);
    });
}

function roleData(id) {
  Api.getRole(id)
    .then((response) => {
      const data_item = response.data;
      selected.id = data_item.id || null;
      selected.name = data_item.name || null;
      selected.key = data_item.key || null;
      selected.sort = data_item.sort || null;
      selected.status = data_item.status || null;
      selected.admin = data_item.admin || null;
      selected.remark = data_item.remark || null;

      selected.homepage_id = data_item.homepage_id || null;
      selected.homepage_path = data_item.homepage_path || null;

      selected.created_at = data_item.created_at || null;
      selected.updated_by = data_item.updated_by || null;
      selected.created_by = data_item.created_by || null;
  
    })
    .catch((err) => {
       console.log("Failed to load menu data:", err);
    });
}


function getButtonItems(nodes) {
  let buttons = [];
  nodes.forEach(node => {
    if (node.type === 'button') {
      if (node.children && Array.isArray(node.children) && node.children.length === 0) {
        delete node.children;  
      }
      buttons.push(node);
    }
    if (node.children) {
      buttons = buttons.concat(getButtonItems(node.children));
    }
  });
  return buttons;
}
function processMenuData(data) {
  return data.map((item) => {
    const node = {
      id: item.id,
      title: item.title,
      type: item.type,
      hasChild: item.hasChild,
      checkbox: item.checkbox || { state: null },
      homepage_id: item.homepage_id || null,
    };

    if (item.hasChild && item.children) {
      node.children = processMenuData(item.children);
    }

    if (item.type === 'button') {
      if (node.checkbox && node.checkbox.state === 'checked') {
        node.checkbox.state = 'checked';
      } else if (node.checkbox && node.checkbox.state !== 'checked') {
        node.checkbox.state = 'unchecked';
      } else {
        node.checkbox.state = null;
      }
    } else {
      node.checkbox.state = null;
    }

    return node;
  });
}

function filterUncheckedNodes(nodes) {
  return nodes.filter(node => node.hasChild == true) 
    .map(node => {

      if (node.children && node.children.length === 0) {
        delete node.children;
      }

      if (node.children) {
        node.children = filterUncheckedNodes(node.children);
        // if (node.children.length === 0) {
        //   delete node.children;
        // }
      }
      return node;
    });
}

const treeValueCount = ref([])

function onNodeSelectionChange(selectedIds) {
  if (!selectedIds || !selectedIds.id) return; 
  const { id, title } = selectedIds; 

  previousSelection = [
    ...tree.value.filter(node => node.checkbox === null)
  ];
  if (tree.value.length < previousSelectionValue.value.length){
    previousSelectionValue.value = [...tree.value];
  }else {
   previousSelectionValue.value = [...previousSelectionValue.value, ...previousSelection];
  }
  function findAllHasChildNodes(nodes) {
    let result = [];
    for (const node of nodes) {
      if (node.hasChild) {
        if (node.id === id) {
          return node.children || []; 
        }
        if (node.children) {
          const found = findAllHasChildNodes(node.children);
          if (found.length) {
            return found; 
          }
        }
      }
    }
    return result;
  } 


  let preselectedNodes = [...previousSelection];
  const foundNodes = findAllHasChildNodes(rawData.value);
  tree.value = getPreselectedNodes(rawData.value);
  treeValueCount.value = tree.value

  buttonItems.value = getButtonItems(foundNodes);
}

function processButtonItems(nodes) {
 
  return nodes.map(node => {
    if (node.type === 'button') {
      if (node.checkbox) {
        if (node.checkbox.state === 'checked') {
          node.checkbox.state = 'checked';
        } else if (node.checkbox.state === 'unchecked') {
          node.checkbox.state = 'unchecked';
        } else {
          node.checkbox.state = null; 
        }
      }
    }

    if (node.children) {
      node.children = processButtonItems(node.children); 
    }

    return node;
  });
}

function getPreselectedNodesForNonButton(data) {
  let selectedIds = []; 
  let addedParentIds = new Set();  

  function traverse(node, parent = null) {
    if (node.checkbox && node.checkbox.state === 'checked') {
      if (parent && !addedParentIds.has(parent.id)) {
        selectedIds.push(parent.id);  
        addedParentIds.add(parent.id);  
      }
      return; 
    }

    if (node.hasChild && Array.isArray(node.children) && node.children.length > 0) {
      node.checkbox = { state: 'checked' };
      node.children.forEach(child => traverse(child, node)); 
    }
  }

  data.forEach(item => traverse(item));
  return selectedIds;  
}

function getPreselectedNodes(nodes) {
  let selected = [];
  const selectedIds = new Set();
  const treeCount = tree.value

  if (previousSelectionValue.value && previousSelectionValue.value.length > 0) {
    previousSelectionValue.value.forEach(item => {
      if (!selectedIds.has(item.id)) {
        selected.push(item);
        selectedIds.add(item.id);
        if (item.parent) {
          addNodeAndParents(item.parent);
        }
      }
    });
  }

  function addNodeAndParents(node) {
    if (!selectedIds.has(node.id)) {
      selected.push(node);
      selectedIds.add(node.id);
    }

    if (node.parent) {
      addNodeAndParents(node.parent);
    }
  }

  function removeNodeAndParents(node) {
    selected = selected.filter(n => n.id !== node.id);
    selectedIds.delete(node.id);
    if (node.parent) {
      removeNodeAndParents(node.parent);
    }
  }

  nodes.forEach(node => {
    if (node.type === 'button') {
      if (node.checkbox && node.checkbox.state === 'checked') {
        addNodeAndParents(node);
      } else if (node.checkbox && node.checkbox.state === 'unchecked') {
        removeNodeAndParents(node);
      }
    }

    if (node.children) {
      selected.push(...getPreselectedNodes(node.children));
    }
  });
  if (deleteButton.value && deleteButton.value.length > 0) {
    deleteButton.value.forEach(button => {
      selected = selected.filter(node => node.id !== button.id || node.title !== button.title);
    });
  }
  if (selected.length > treeCount.length && treeCount.length != 0) {
    const extraNodes = selected.filter(selNode => 
      !treeCount.some(treeNode => treeNode.id === selNode.id)
    );
    extraNodes.forEach(node => {
      if (node.checkbox) {
        node.checkbox = null;
      }
    });
  }

  return selected;
}


function selectAllChildren(parent, selectedItems) {
  if (parent.children) {
    parent.children.forEach(child => {
      if (!selectedItems.includes(child)) {
        selectedItems.push(child); 
      }
    });
  }
}

function onClickClose(selection) {
  tree.value = tree.value.filter(item => item.id !== selection.id);
}

function getParentTitle(selection) {
    let parentTitle = '';
    
    function findParent(nodes, selectedNode) {
      for (let node of nodes) {
        if (node.children && node.children.some(child => child.id === selectedNode.id)) {
          parentTitle = node.title;  
          return;
        }
        if (node.children) {
          findParent(node.children, selectedNode);
        }
      }
    }
    
    findParent(items.value, selection);
  
    return parentTitle;
}

async function onSearchInput() {
  buttonItems.value = [];

  if (searchQuery.value.trim() === "") {
    items.value = processMenuData(rawData.value);
    filteredItems.value = filterUncheckedNodes(items.value);
    tree.value = getPreselectedNodes(items.value); 
    buttonItems.value = [];
    return;
  }

  const payloadId = {
    id: selected.id, 
    ...selected.table.options, 
    search_role: searchQuery.value.trim(), 
  };

  try {
    const response = await Api.gitSearch(payloadId);
    
    if (response && response.data) {
      filteredItems.value = filterUncheckedNodes(response.data.options);
      tree.value = getPreselectedNodes(filteredItems.value); 
      items.value = processMenuData(filteredItems.value);  

    } else {
       console.warn("Empty response from search API");
      filteredItems.value = [];
    }
  } catch (error) {
     console.error("Search error:", error);
  }
}

function searchInItems(nodes, query) {
  return nodes
    .map(item => {
      const children = item.children && item.children.length > 0 ? searchInItems(item.children, query) : [];

      const matches = item.title.toLowerCase().includes(query) || children.length > 0;

      if (matches) {
        return {
          ...item,
          children: children,
        };
      }
      return null; 
    })
    .filter(item => item !== null);
}

const selected = reactive({
    id: null,
    name: null,
    key: null,
    sort: null,
    status: null,
    admin: null,
    remark: null,
    created_at: null,
    updated_by: null,
    created_by: null,

    menu: [],
    permission: [],
    homepage_id: null,
    homepage_path: null,
    menuPermissions: [],
    mill: [],
    table: {
    rows: {
      items: [],
      total: null,
    },
    options: {
      q: "",
      page: 1,
      itemsPerPage: 10,
      sortBy: ["sort"],
      descending: [false],
    },
    loading: false,
  },
});

const menuPermissions = reactive({
  checked: [],
  undetermined: []
});

const handleReset = () => {
  searchQuery.value = ''
  onSearchInput()
};


const save = async () => {
  previousSelectionValue.value.forEach(item => {
    if (!tree.value.some(treeItem => treeItem.id === item.id)) {
      tree.value.push(item); 
    }
  });

  menuPermissions.checked = tree.value.filter(item => !item.checkbox || item.checkbox.state == 'unchecked');
  
  let allSelectedItems = [...tree.value];

  menuPermissions.checked.forEach(item => {
    selectAllParents(item, allSelectedItems);
  });

  const filteredItems = allSelectedItems.filter(item => item.type === null);

  const uniqueFilteredItems = [...new Map(filteredItems.map(item => [item.id, item])).values()];

  const otherItems = allSelectedItems.filter(item => item.type !== null);
  const uniqueSelectedItems = [...uniqueFilteredItems, ...otherItems];
  const menuPermissionsData = uniqueSelectedItems.map(item => ({
    id: item.id,
    title: item.title,
    type: item.type,
  }));
  selected.menuPermissions = menuPermissionsData;

  if (!selected.id) {
    selected.flex_form_data = {};
    selected.name = selected.name || 'name';  
    selected.key = selected.key || 'key';    

    try {
      await Api.create(selected);
      toast.success("Create Success", {
        position: "bottom-center"
      });
    } catch (err) {
        (err)
    }
  } else {
    const selectMill = Object.values(selected.mill).map(cur => (
      Number.isFinite(cur) && !isNaN(cur) ? cur : cur.id
    ));
    selected.mill = selectMill;

    selected.name = selected.name || 'name';
    selected.key = selected.key || 'key';

    try {
      await Api.update(selected);
      toast.success("Update Success", {
        position: "bottom-center"
      });
    } catch (err) {
        (err)
    }
  }
};

function selectAllParents(child, selectedItems) {
  let parent = child.parent;

  while (parent) {
    if (!selectedItems.some(item => item.id === parent.id)) {
      selectedItems.push(parent); 
    }
    const hasUncheckedChildren = parent.children && parent.children.some(child => child.checkbox && child.checkbox.state !== 'checked');
    
    if (hasUncheckedChildren) {
      parent.checkbox.state = null;
    }
    parent = parent.parent; 
  }
}

function resetSelection() {
  tree.value = [];
  searchQuery.value = '';
  filteredItems.value = items.value;
}
</script>

<style scoped>
.chip-large {
  font-size: 18px; 
  padding: 12px 20px;
  width: auto; 
  min-width: 150px; 
  height: 40px; 
}

.chip-large .v-chip__content {
  font-size: 18px; 
}
</style>
