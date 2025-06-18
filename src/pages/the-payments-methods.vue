<template>
  <div class="user-payment-methods">
    <header>
      <TheHeaderSession />
    </header>

    <div class="content">
      <!-- Título y botón + -->
      <div class="title-bar">
        <h1 class="page-title">Mis Métodos de Pago</h1>
        <Button
            v-if="paymentMethods.length > 0"
            icon="pi pi-plus"
            class="p-button-success p-button-rounded p-button-sm ml-3"
            @click="openAddForm"
            aria-label="Agregar método de pago"
        />
      </div>

      <!-- Botón agregar cuando no hay métodos -->
      <div v-if="paymentMethods.length === 0" class="mb-4 text-center">
        <Button
            label="Agregar nuevo método de pago"
            class="p-button-success"
            @click="openAddForm"
        />
      </div>

      <!-- Tarjetas -->
      <div class="cards-container">
        <div v-for="method in paymentMethods" :key="method.id" class="card1">
          <div class="p-4 border-round surface-card shadow-2 card-content">
            <h2 class="method-title">
              {{ method.card_type }} - **** **** **** {{ method.last_digits }}
            </h2>
            <p class="method-info">
              Válido hasta: {{ method.expiration_month }}/{{ method.expiration_year }}
            </p>
            <div class="card-buttons">
              <Button label="Editar" class="p-button-success-light" @click="openEditForm(method)" />
              <Button label="Eliminar" class="p-button-success-dark" @click="deleteMethod(method.id)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal formulario -->
      <div v-if="showForm" class="modal-overlay">
        <div class="payment-form">
          <h3>{{ editingMethod ? 'Editar Método de Pago' : 'Agregar Método de Pago' }}</h3>
          <form @submit.prevent="submitForm">
            <input v-model="form.card_type" placeholder="Tipo de tarjeta (Visa, MasterCard...)" required />
            <input v-model="form.last_digits" placeholder="Últimos 4 dígitos" maxlength="4" required />
            <input v-model="form.expiration_month" type="number" min="1" max="12" placeholder="Mes de expiración (MM)" required />
            <input v-model="form.expiration_year" type="number" min="2024" placeholder="Año de expiración (YYYY)" required />

            <div class="mt-3">
              <Button type="submit" label="Guardar" class="p-button-success mr-2" />
              <Button label="Cancelar" class="p-button-secondary" @click="cancelForm" />
            </div>
          </form>
        </div>
      </div>
    </div>

    <footer>
      <TheFooter />
    </footer>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import Button from 'primevue/button';
import TheHeaderSession from "@/components/elements/the-header-session.component.vue";
import TheFooter from "@/components/elements/the-footer.component.vue";
import PaymentMethodApiService from "@/shared/services/payment-api.service.js";

export default {
  name: 'UserPaymentMethods',
  components: {
    Button,
    TheHeaderSession,
    TheFooter
  },
  setup() {
    const paymentMethods = ref([]);
    const userId = localStorage.getItem('userId');
    const showForm = ref(false);
    const editingMethod = ref(null);
    const form = reactive({
      card_type: '',
      last_digits: '',
      expiration_month: '',
      expiration_year: ''
    });

    const fetchPaymentMethods = async () => {
      try {
        if (!userId) return;
        const response = await PaymentMethodApiService.getByUserId(userId);
        paymentMethods.value = response.data;
      } catch (error) {
        console.error('Error al obtener métodos de pago:', error);
      }
    };

    const deleteMethod = async (id) => {
      try {
        await PaymentMethodApiService.delete(id);
        await fetchPaymentMethods();
      } catch (error) {
        console.error('Error al eliminar método de pago:', error);
      }
    };

    const openAddForm = () => {
      showForm.value = true;
      editingMethod.value = null;
      Object.assign(form, {
        card_type: '',
        last_digits: '',
        expiration_month: '',
        expiration_year: ''
      });
    };

    const openEditForm = (method) => {
      showForm.value = true;
      editingMethod.value = method;
      Object.assign(form, { ...method });
    };

    const cancelForm = () => {
      showForm.value = false;
      editingMethod.value = null;
    };

    const submitForm = async () => {
      try {
        if (!form.card_type || !form.last_digits || !form.expiration_month || !form.expiration_year) {
          alert('Por favor, completa todos los campos.');
          return;
        }

        if (editingMethod.value) {
          await PaymentMethodApiService.update(editingMethod.value.id, form);
        } else {
          await PaymentMethodApiService.create({ ...form, user_id: userId });
        }

        showForm.value = false;
        await fetchPaymentMethods();
      } catch (error) {
        console.error('Error al guardar método de pago:', error);
      }
    };

    onMounted(fetchPaymentMethods);

    return {
      paymentMethods,
      deleteMethod,
      showForm,
      form,
      openAddForm,
      openEditForm,
      cancelForm,
      submitForm,
      editingMethod
    };
  }
};
</script>

<style scoped>
.user-payment-methods {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f4f8f4;
}

/* Header fijo pero no causa recorte de contenido */
header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}


footer {
  background-color: #2c3e50;
  padding: 15px 0;
  font-size: 16px;
  line-height: 24px;
  color: #e0e0e0;
  text-align: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
}

/* Main content crece dinámicamente */
.content {
  flex: 1;
  padding-top: 80px;
  padding-bottom: 40px;
}

.title-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 2rem 1rem 1rem;
  gap: 21px;
}

.page-title {
  font-size: 2.2rem;
  color: #1a493f;
  font-weight: bold;
  margin: 0;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 24px;
  margin-top: 20px;
  padding: 0 1.5rem;
}

.card1 {
  width: 320px;
  background: #f8f9fa;
  border: 1px solid #dcdcdc;
  border-radius: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card1:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 24px;
  text-align: left;
}

.method-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.method-info {
  font-size: 1rem;
  color: #555;
  margin-bottom: 16px;
}

.card-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.card-buttons Button {
  flex: 1;
}

.p-button-success-light {
  background-color: #A3D9A5;
  border: none;
  color: #1b3d1f;
}

.p-button-success-dark {
  background-color: #2F6231;
  border: none;
  color: #fff;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Formulario */
.payment-form {
  width: 90%;
  max-width: 400px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.payment-form h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #1a493f;
}

.payment-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
