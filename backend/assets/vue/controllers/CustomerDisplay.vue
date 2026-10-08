<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const customer = ref(null);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        const response = await fetch(`/api/v1/customers/${encodeURIComponent(props.id)}`);

        if (response.status === 404) {
            error.value = 'Customer not found.';
            return;
        }

        if (!response.ok) {
            error.value = 'Unable to load the customer.';
            return;
        }

        customer.value = await response.json();
    } catch {
        error.value = 'Unable to load the customer. Please check your connection and try again.';
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <p v-if="loading">Loading customer...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <dl v-else-if="customer">
        <dt>Id</dt>
        <dd>{{ customer.id }}</dd>

        <dt>Name</dt>
        <dd>{{ customer.name }}</dd>

        <dt>Email</dt>
        <dd>{{ customer.email }}</dd>

        <dt>Status</dt>
        <dd>{{ customer.status }}</dd>
    </dl>
</template>
