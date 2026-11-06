<script setup>
import { computed, onMounted, ref } from 'vue';
import { CsrfError, get, NetworkError, patch } from '../http/client.js';
import UiError from '../ui/UiError.vue';
import UiLoading from '../ui/UiLoading.vue';
import UiSwitch from '../ui/UiSwitch.vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const customer = ref(null);
const loading = ref(true);
const loadError = ref(null);
const loadRetryable = ref(false);
const actionError = ref(null);
const actionRetryable = ref(false);
const submitting = ref(false);
const pendingStatus = ref(null);

const switchStatus = computed(() => pendingStatus.value ?? customer.value?.status);
const switchChecked = computed(() => switchStatus.value === 'ACTIVE');
const oppositeStatus = computed(() => switchChecked.value ? 'INACTIVE' : 'ACTIVE');
const actionLabel = computed(() => oppositeStatus.value === 'ACTIVE' ? 'Activate customer' : 'Deactivate customer');

function errorMessage(requestError, action = 'load') {
    if (requestError.status === 404) {
        return 'Customer not found.';
    }

    if (requestError instanceof NetworkError) {
        return action === 'update'
            ? 'Unable to update the customer. Please check your connection and try again.'
            : 'Unable to load the customer. Please check your connection and try again.';
    }

    if (requestError instanceof CsrfError) {
        return 'Unable to update the customer because the security token could not be verified.';
    }

    return action === 'update' ? 'Unable to update the customer.' : 'Unable to load the customer.';
}

function canRetry(requestError) {
    return requestError instanceof NetworkError || (requestError.status >= 500 && requestError.status < 600);
}

async function loadCustomer() {
    loading.value = true;
    loadError.value = null;
    loadRetryable.value = false;

    try {
        const response = await get(`/api/v1/customers/${encodeURIComponent(props.id)}`, {
            headers: { Accept: 'application/json' },
        });
        customer.value = await response.json();
    } catch (requestError) {
        loadError.value = errorMessage(requestError);
        loadRetryable.value = canRetry(requestError);
    } finally {
        loading.value = false;
    }
}

async function updateStatus() {
    if (submitting.value || !customer.value) {
        return;
    }

    const requestedStatus = oppositeStatus.value;
    pendingStatus.value = requestedStatus;
    submitting.value = true;
    actionError.value = null;
    actionRetryable.value = false;

    try {
        const response = await patch(`/api/v1/customers/${encodeURIComponent(props.id)}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: requestedStatus }),
        });
        customer.value = await response.json();
        pendingStatus.value = null;
    } catch (requestError) {
        pendingStatus.value = null;
        actionError.value = errorMessage(requestError, 'update');
        actionRetryable.value = canRetry(requestError);
    } finally {
        submitting.value = false;
    }
}

onMounted(loadCustomer);
</script>

<template>
  <UiLoading v-if="loading">
    Loading customer...
  </UiLoading>
  <UiError
    v-else-if="loadError"
    :retryable="loadRetryable"
    @retry="loadCustomer"
  >
    {{ loadError }}
  </UiError>
  <div v-else-if="customer">
    <UiError
      v-if="actionError"
      :retryable="actionRetryable"
      @retry="updateStatus"
    >
      {{ actionError }}
    </UiError>

    <dl>
      <dt>Id</dt>
      <dd>{{ customer.id }}</dd>

      <dt>Name</dt>
      <dd>{{ customer.name }}</dd>

      <dt>Email</dt>
      <dd>{{ customer.email }}</dd>

      <dt>Status</dt>
      <dd>{{ customer.status }}</dd>
    </dl>

    <UiSwitch
      :model-value="switchChecked"
      :aria-label="actionLabel"
      :loading="submitting"
      @update:model-value="updateStatus"
    />
  </div>
</template>
