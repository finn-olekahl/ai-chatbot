<template>
    <h1>Settings</h1>
    <p>Settings page</p>
    <div>
        <label for="standard-prompt">Standard prompt</label>
        <textarea id="standard-prompt" v-model="standardPrompt"></textarea>
        <button @click="save">Save</button>
    </div>
    <table>
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(value, key, index) in map" :key="index">
                <td><input :key="componentKey" :value="key" @input="updateKey(index, ($event.target as HTMLInputElement)?.value)" /></td>
                <td><input v-model="map[key]" /></td>
                <td><button @click="deleteRow(key as string)">Delete</button></td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td><input v-model="newKey" /></td>
                <td><input v-model="newValue" /></td>
                <td><button @click="addRow">Add</button></td>
            </tr>
        </tfoot>
    </table>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { SettingsMap } from "../../../types";

definePageMeta({
    middleware: 'auth'
})

const standardPrompt = ref('');
const componentKey = ref(0);
let map: SettingsMap = reactive({});
const newKey = ref('');
const newValue = ref('');

onMounted(async () => {
    const prompt = await getPrompt();
    if (prompt === null) {
        return;
    }
    standardPrompt.value = prompt.standard;
    map = prompt.faq;
});

const { getPrompt, updatePrompt } = useSettings();

const save = async () => {
    await updatePrompt(standardPrompt.value, map);
};

const addRow = () => {
    map[newKey.value] = newValue.value;
    newKey.value = '';
    newValue.value = '';

    save();
};

const deleteRow = (key: string) => {
    delete map[key];
    componentKey.value++;
    save();
};

const updateKey = (index: number, newKey: string) => {
    // Get the old key
    const oldKey = Object.keys(map)[index];

    // Check if the new key is already in use
    if (map.hasOwnProperty(newKey)) {
        alert('This key is already in use');
        return;
    }

    // Add the new key with the old value
    map[newKey] = map[oldKey];

    // Delete the old key
    delete map[oldKey];

    console.log(map);
}

</script>