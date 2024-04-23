<template>
    <div class="content-wrapper">
        <div class="header-wrapper-dashboard">
            <h1><button class="goback-btn" @click="$router.push('/admin/dashboard')"><i class="fas fa-arrow-left"></i></button>Settings</h1>
        </div>
        <div class="basic-instructions-wrapper">
            <div class="title-wrapper">
                <h5>Basic Instructions</h5>
                <p class="sub">You can enter the basic instructions for the Assistant to follow. This should not include specific answers to given questions, those can be added in the specific instructions below.</p>
            </div>
            <textarea id="basic-instructions" v-model="basicInstructions"></textarea>
        </div>
        <div class="specific-instructions-wrapper">
            <div class="title-wrapper">
                <h5>Specific Instructions</h5>
                <p class="sub">You can enter specific instructions here, including standard answers for specific or similar questions.</p>
            </div>
            <table class="instruction-table">
                <thead>
                    <tr>
                        <th>Sample Question</th>
                        <div class="spacer"></div>
                        <th>Exact Answer</th>
                        <div class="spacer"></div>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(value, key, index) in map" :key="index">
                        <td><input :key="componentKey" :value="key" @input="updateKey(index, ($event.target as HTMLInputElement)?.value)" /></td>
                        <div class="spacer"></div>
                        <td><input v-model="map[key]" /></td>
                        <div class="spacer"></div>
                        <td><button class="delete-btn" @click="deleteRow(key as string)">Delete</button></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><input class="left" v-model="newKey" /></td>
                        <div class="spacer"></div>
                        <td><input v-model="newValue" /></td>
                        <div class="spacer"></div>
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
import type { SettingsMap } from "~/types";

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
    margin-top: 20px;
    margin-bottom: 150px;
    width: 50vw;
    color: white;
    background-color: #007f51;
    border: none;
    padding: 10px 30px;
    border-radius: 999px;
    transition: all 0.15s ease;
}

#save-btn:hover {
    transform: scale(1.02);
}

#save-btn:active:hover {
    transform: scale(1.0);
}

h5 {
    font-size: 20px;
    margin-bottom: 5px;
    color: black;
    font-weight: 500;
}

p {
    width: 50%;
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
    box-shadow: inset 0px 0px 0px 2px #007f51;
    scrollbar-width: 0px;
    border: none;
}

#basic-instructions::-webkit-scrollbar {
    display: none;
}

.title-wrapper {
    width: 96%;
}

.instruction-table {
    width: 100%;
}

td > input {
    width: 100%;
    padding: 10px 30px;
    border-radius: 999px;
    border: none;
    box-shadow: inset 0px 0px 0px 2px #007f51;
}
td > button {
    width: 100%;
    color: white;
    background-color: black;
    border: none;
    padding: 10px 30px;
    border-radius: 999px;
}

td > .delete-btn {
    color: white;
    background-color: rgb(154, 0, 0);
}

.spacer {
    width: 5px;
}

th {
    padding-left: 10px;
    padding-bottom: 5px;
    padding-top: 20px;
    text-align: left;
}

td {
    padding-top: 10px;
}
</style>