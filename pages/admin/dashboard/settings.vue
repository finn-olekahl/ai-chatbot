<template>
    <div class="content-wrapper">
        <div class="header-wrapper-dashboard">
            <h1>Settings</h1>
        </div>
        <div class="basic-instructions-wrapper">
            <h5>Basic Instructions</h5>
            <p class="sub">You can enter the basic instructions for the Assistant to follow. This should not include specific answers to given questions, those can be added in the specific instructions below.</p>
            <textarea id="basic-instructions" v-model="basicInstructions"></textarea>
        </div>
        <div class="specific-instructions-wrapper">
            <h5>Specific Instructions</h5>
            <p class="sub"></p>
            <table>
                <thead>
                    <tr>
                        <th>Sample Question</th>
                        <th>Exact Answer</th>
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
        </div>
        <button id="save-btn" @click="save">Save</button>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { SettingsMap } from "../../../types";

definePageMeta({
    middleware: 'auth'
})

const basicInstructions = ref('');
const componentKey = ref(0);
let map: SettingsMap = reactive({});
const newKey = ref('');
const newValue = ref('');

onMounted(async () => {
    const instructions = await getInstructions();
    if (instructions === null) {
        return;
    }
    basicInstructions.value = instructions.standard;
    map = instructions.faq;
});

const { getInstructions, updateInstructions } = useSettings();

const save = async () => {
    await updateInstructions(basicInstructions.value, map);
};

const addRow = () => {
    map[newKey.value] = newValue.value;
    newKey.value = '';
    newValue.value = '';
};

const deleteRow = (key: string) => {
    delete map[key];
    componentKey.value++;
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

<style scoped>
.content-wrapper {
    display: flex;
    width: 100vw;
    flex-direction: column;
    align-items: center;
}

.basic-instructions-wrapper {
    margin-top: 40px;
    display: flex;
    width: 50vw;
    align-items: center;
    flex-direction: column;
}

.specific-instructions-wrapper {
    margin-top: 75px;
    display: flex;
    width: 50vw;
    align-items: center;
    flex-direction: column;
}

#save-btn {
    margin-top: 30px;
  width: 300px;
  color: white;
  background-color: #007f51;
  border: none;
  padding: 10px 30px;
  border-radius: 999px;
}

h5 {
    font-size: 20px;
    margin-bottom: 5px;
    color: black;
    font-weight: 500;
}

p {
    width: 50%;
    text-align: center;
    font-size: 12px;
    opacity: 0.6    ;
    margin-bottom: 25px;
}

#basic-instructions {
    width: 100%;
    height: 60vh;
    resize: none;
    padding: 20px;
    border-radius: 20px;
    border-color: #007f51;
    scrollbar-width: 0px;
}

#basic-instructions::-webkit-scrollbar {
    display: none;
}
</style>