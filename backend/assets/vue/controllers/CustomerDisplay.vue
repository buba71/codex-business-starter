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
const retryable = ref(false);

async function loadCustomer() {
    loading.value = true;
    error.value = null;
    retryable.value = false;

    let response;

    try {
        response = await fetch(`/api/v1/customers/${encodeURIComponent(props.id)}`);

        if (response.status === 404) {
            error.value = 'Customer not found.';
            return;
        }

        if (!response.ok) {
            error.value = 'Unable to load the customer.';
            retryable.value = response.status >= 500 && response.status < 600;
            return;
        }

        customer.value = await response.json();
    } catch {
        error.value = 'Unable to load the customer. Please check your connection and try again.';
        retryable.value = response === undefined;
    } finally {
        loading.value = false;
    }
}

onMounted(loadCustomer);
</script>

<template>
    <p v-if="loading">Loading customer...</p>
    <template v-else-if="error">
        <p role="alert">{{ error }}</p>
        <button v-if="retryable" type="button" @click="loadCustomer">Retry</button>
    </template>
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
