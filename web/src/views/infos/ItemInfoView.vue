<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import AppForm from '@/components/AppForm.vue'
import TextInput from '@/components/TextInput.vue'
import { i18n, i18nText } from '@/i18n'
import IconMore from '@/icons/IconMore.vue'
import IconSearch from '@/icons/IconSearch.vue'
import { paths } from '@/utils/item'
import { viewOptions } from '@/views/viewOptions'
import { Text, type ItemType, type ServerItemInfo } from '@sonolus/core'
import { ref } from 'vue'
import ItemSection from '../details/ItemSection.vue'

defineOptions(
    viewOptions<typeof props>({
        url: ({ type }) => `/${paths[type]}/info`,
        loading: ({ i18n, props: { type } }) => i18n.clients.customServer[type].info.loading,
        error: ({ i18n, props: { type } }) =>
            i18n.clients.customServer[type].info.error(import.meta.env.VITE_TITLE),

        title: ({ i18n, props: { type, data } }) =>
            data?.title ? i18nText(data.title) : i18n.routes.server.infos[type].title,
        banner: ({ data }) => data?.banner?.url ?? undefined,
    }),
)

const props = defineProps<{
    type: ItemType
    data: ServerItemInfo
}>()

const search = ref('')
const keywords = () => search.value.trim()
</script>

<template>
    <AppForm>
        <TextInput
            v-model="search"
            :icon="IconSearch"
            :placeholder="i18nText(Text.KeywordsPlaceholder)"
        />
        <div class="mt-10 flex flex-wrap justify-center gap-10 sm:mt-12 sm:gap-12">
            <AppButton
                :to="{
                    name: `${type}-list`,
                    query: keywords() ? { type: 'quick', keywords: keywords() } : {},
                }"
                :icon="keywords() ? IconSearch : IconMore"
                data-submit
            >
                {{ keywords() ? i18n.common.search : i18n.common.more }}
            </AppButton>
        </div>
    </AppForm>

    <ItemSection v-for="(section, key) in data.sections" :key :section />
</template>
