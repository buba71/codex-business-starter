<script setup>
import { onMounted, ref } from 'vue';
import { get, NetworkError } from '../http/client.js';

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

    try {
        const response = await get(`/api/v1/customers/${encodeURIComponent(props.id)}`);
        customer.value = await response.json();
    } catch (requestError) {
        if (requestError.status === 404) {
            error.value = 'Customer not found.';
            return;
        }

        if (requestError instanceof NetworkError) {
            error.value = 'Unable to load the customer. Please check your connection and try again.';
            retryable.value = true;
        } else if (requestError.status >= 500 && requestError.status < 600) {
            error.value = 'Unable to load the customer.';
            retryable.value = true;
        } else {
            error.value = 'Unable to load the customer.';
        }
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
