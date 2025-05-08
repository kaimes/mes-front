<template>
    <div class="pa-4 text-center">
        <v-dialog v-model="dialogs.MoveToShow" max-width="800" @click:outside="dialogClose">
            <v-card prepend-icon="mdi-information" :title="$t('semi.move_button.move_to')">
                <v-card-text>
                    <v-row dense>
                        <v-col cols="9">
                            <v-card :title="$t('semi.move_button.selected_list')" :text="dialogs.selectedCode" variant="flat"></v-card>
                        </v-col>
                        <v-col cols="3">
                            <v-checkbox v-if="dialogs.showMergeBloom"
                                v-model="mergeBloom"
                                label="Merge Bloom"
                            ></v-checkbox>
                        </v-col>
                        <!-- <v-card title="Selected List" :text="dialogs.selectedCode" variant="flat"></v-card> -->
                    </v-row>

                    <v-row dense>
                        <v-col>
                            {{ $t('semi.move_button.site_type_no') }}
                            <v-combobox v-model="siteTypeNo" :items="siteTypeOptions" :variant="textVariant"  required
                                :menu-props="{ maxHeight: '250px' }" :search-input.sync="search"
                                @update:search-input="filterItems" @update:modelValue="getsiteBySiteType" />
                        </v-col>

                        <v-col>
                            {{ $t('semi.move_button.site_no') }}
                            <v-combobox v-model="siteNo" :items="siteOptions" :variant="textVariant"  required
                                :menu-props="{ maxHeight: '250px' }" :search-input.sync="search"
                                @update:search-input="filterItems" @update:modelValue="getAreaBySite" />
                        </v-col>

                        <v-col>
                            {{ $t('semi.move_button.area_no') }}
                            <v-combobox v-model="areaNo" :items="areaOptions" :variant="textVariant"  required
                                :menu-props="{ maxHeight: '250px' }" :search-input.sync="search"
                                @update:search-input="filterItems" @update:modelValue="findSiteByArea"/>
                            <!-- 禁用 Area No. 直到 Site No. 被选择 -->
                        </v-col>

                        <v-col>
                            {{ $t('semi.move_button.position') }}
                            <v-text-field :placeholder="$t('semi.move.position')" :variant="textVariant"
                                v-model="location"></v-text-field>
                        </v-col>
                    </v-row>

                    <div class="font-weight-medium">{{ $t('semi.move_button.are_you_sure_to_move_this_semi') }}</div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn class="text-none" color="#e3e3e3" variant="flat" :loading="loading"
                        @click="colseDialogByButton" style="margin-right: 16px;">{{ $t('semi.move_button.close') }}</v-btn>

                    <v-btn class="text-none mr-4" color="primary" variant="flat" @click="inputText">{{ $t('semi.move_button.save') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useSemiStore } from "@/semi_admin/semi/storePinia";
import Api from "@/semi_admin/semi/api";
import { toast } from "vue3-toastify";
import { reactive } from 'vue';
import { useAppStore } from '../../app/storePinia';
import { th } from "date-fns/locale";

export default {
    data() {
        return {
            textVariant: "outlined",
            siteNo: "",
            areaNo: "",
            location: "",
            siteTypeNo: "",
            siteOptions: [],
            areaOptions: [],
            siteTypeOptions: [],
            alert: false,
            mergeBloom: true,
        }
    },

    computed: {
        ...mapState(useSemiStore, ["table", "dialogs", "shouldExecuteGetAll"]),
    },

    methods: {
        ...mapActions(useSemiStore, [
            'colseDialogByButton',
            'getAll',
            'getAllNew'
        ]),

        dialogClose() {
            this.alert = false;
        },

        async inputText() {
            const requestData = [];
            const state = reactive(this.table.rows.selectedItems);
            if (!state || state.length === 0) {
                this.alert = true;
                toast.error("Please select at least one Semi!", { autoClose: 60000 })
                return; // 退出方法
            }

            if (this.siteNo === "" || this.areaNo === "") {
                toast.error("Please select at Site or Area!", { autoClose: 60000 })
                return;
            }

            for (let item of state) {
                requestData.push({
                    id: item.id,
                    site_code: this.siteNo,
                    area_code: this.areaNo,
                    location: this.location
                });
            }

            const reqData = { requestData };
            if (requestData.length === 0) {
                this.alert = true;
                return; // 退出方法
            }

            if (this.dialogs.showMergeBloom) {
                reqData.mergeBloom = this.mergeBloom;
            }

            await Api.updateSemi('/semi/update_semi', reqData).then(res => {

                if (this.shouldExecuteGetAll){
                    this.getAllNew({});
                }
                
                toast.success("Semi move successfully!", { position: "bottom-center" })
                this.dialogs.showMergeBloom = false; 
                this.dialogs.MoveToShow = false; // 关闭对话框
                this.$emit("refresh");
            }).catch(error => {
                console.error(error);
                this.alert = true; // 显示错误
            })

            // 清空输入
            this.siteNo = "";
            this.areaNo = "";
            this.location = "";
        },

        getArea() {
            Api.getSemi('/area/item/code/semi/move').then(response => {
                if (response.data && response.data.length) {
                    this.areaOptions = [];
                    response.data.forEach(element => {
                        this.areaOptions.push(element.area_code)
                    });
                }
            })
        },
        getSite() {
            Api.getSemi('/area/item/site/code/semi/move')
                .then(response => {
                    if (response.data && response.data.length) {
                        this.siteOptions = [];
                        response.data.forEach(element => {
                        this.siteOptions.push(element.site_code)
                    });
                    }
                });
        },

        getSiteType() {
            Api.getSemi('/area/item/site_type/code/semi/move')
                .then(response => {
                    if (response.data && response.data.length) {
                        this.siteTypeOptions = [];
                        response.data.forEach(element => {
                        this.siteTypeOptions.push(element.site_type_code)
                    });
                    }
                });
        },



        getsiteBySiteType() {
            if (!this.siteTypeNo) {
                // 如果 siteTypeNo 为空，直接返回，避免发送无用请求
                this.siteOptions = [];
                return;
            }

            // 使用模板字符串将 siteNo 插入到 URL 中
            const url = `/site/item/get_site_by_site_type/${this.siteTypeNo}`;

            Api.getSemi(url).then(response => {
                if (response.data && response.data.length) {
                    // 更新 areaOptions 为接口返回的数据
                    this.siteOptions = response.data;
                } else {
                    // 如果没有数据，清空 areaOptions
                    this.siteOptions = [];
                    this.areaOptions = []
                }
            }).catch(error => {
                console.error(error);
                // 如果请求失败，也清空 areaOptions
                this.siteOptions = [];
            });
        },

        getAreaBySite() {
            if (!this.siteNo) {
                // 如果 siteNo 为空，直接返回，避免发送无用请求
                this.areaOptions = [];
                return;
            }

            // 使用模板字符串将 siteNo 插入到 URL 中
            const url = `/area/item/get_area_by_site/${this.siteNo}`;

            Api.getSemi(url).then(response => {
                if (response.data && response.data.length) {
                    // 更新 areaOptions 为接口返回的数据
                    this.areaOptions = response.data;
                } else {
                    // 如果没有数据，清空 areaOptions
                    this.areaOptions = [];
                }
            }).catch(error => {
                console.error(error);
                // 如果请求失败，也清空 areaOptions
                this.areaOptions = [];
            });
        },


        findSiteByArea(){
            if (!this.areaNo){
                return
            }
            const url = `/area/item/get_site_by_area/${this.areaNo}`;
            Api.getSemi(url).then(response => {
                    this.siteNo = response.data.site_code,
                    this.siteTypeNo = response.data.site_type_code
                }).catch(error => {
                    console.error(error);
                    this.siteNo = "",
                    this.siteTypeNo = ""
                })
        }

    },

    mounted() {
        this.getSite();
        this.getArea();
        this.getSiteType();
    },

    watch: {
        // 监听 siteNo 变化，如果 siteNo 为空，清空 areaNo
        siteNo(newValue) {
            if (!newValue) {
                this.getArea();
                this.areaNo = ""
            }
        },
        siteTypeNo(newValue) {
            if (!newValue) {
                this.getSite();
                this.SiteNo = ""
            }
        },
        
    }
}
</script>
