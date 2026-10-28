<script setup>
import { onMounted, ref } from 'vue';
import { get, NetworkError } from '../http/client.js';
import UiError from '../ui/UiError.vue';
import UiLoading from '../ui/UiLoading.vue';

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
  <UiLoading v-if="loading">
    Loading customer...
  </UiLoading>
  <UiError
    v-else-if="error"
    :retryable="retryable"
    @retry="loadCustomer"
  >
    {{ error }}
  </UiError>
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
