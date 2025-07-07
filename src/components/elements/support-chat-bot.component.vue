<template>
  <div v-if="visible" class="chat-overlay" @click="handleOverlayClick">
    <div class="chat-container" @click.stop>
      <!-- Header del chat -->
      <div class="chat-header">
        <div class="bot-info">
          <div class="bot-avatar">🤖</div>
          <div class="bot-details">
            <h3 class="bot-name">Asistente IronClad</h3>
            <span class="bot-status">En línea</span>
          </div>
        </div>
        <button @click="$emit('close')" class="close-btn" aria-label="Cerrar chat">
          ✕
        </button>
      </div>

      <!-- Mensajes del chat -->
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="['message', message.sender]"
        >
          <div class="message-content">
            <p v-html="message.text"></p>
            <span class="message-time">{{ formatTime(message.timestamp) }}</span>
          </div>
        </div>
        <div v-if="isTyping" class="message bot typing">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input del chat -->
      <div class="chat-input">
        <div class="input-container">
          <input 
            v-model="currentMessage"
            @keyup.enter="sendMessage"
            @input="handleTyping"
            type="text" 
            placeholder="Escribe tu consulta..."
            class="message-input"
            :disabled="isTyping"
          />
          <button 
            @click="sendMessage" 
            :disabled="!currentMessage.trim() || isTyping"
            class="send-btn"
            aria-label="Enviar mensaje"
          >
            📤
          </button>
        </div>
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.id"
            @click="selectQuickAction(action)"
            class="quick-action-btn"
            :disabled="isTyping"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from 'vue';

export default {
  name: 'SupportChatBot',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const messages = ref([]);
    const currentMessage = ref('');
    const isTyping = ref(false);
    const messagesContainer = ref(null);
    let messageIdCounter = 0;

    const quickActions = ref([
      { id: 1, text: '¿Cómo alquilar un vehículo?' },
      { id: 2, text: 'Métodos de pago' },
      { id: 3, text: 'Políticas de cancelación' },
      { id: 4, text: 'Problemas técnicos' }
    ]);

    // Prompt del sistema para el bot de soporte
    const systemPrompt = `Eres un asistente virtual de soporte técnico para IronClad Rentals, una plataforma de alquiler de vehículos. 

Tu personalidad:
- Amigable, profesional y servicial
- Paciente y comprensivo
- Conoces perfectamente la plataforma y sus funciones
- Respondes en español de manera clara y concisa

Tus funciones principales:
1. Ayudar a los usuarios a alquilar vehículos paso a paso
2. Explicar cómo usar las diferentes funciones de la app
3. Resolver problemas técnicos básicos
4. Informar sobre políticas de la empresa
5. Guiar en el proceso de registro y configuración de cuenta

Información clave de IronClad Rentals:
- Proceso de alquiler: Buscar vehículo → Ver detalles → Seleccionar fechas → Elegir ubicación → Confirmar
- Métodos de pago: Tarjetas de crédito/débito, PayPal
- Cancelación: Permitida hasta 24h antes del inicio del alquiler
- Soporte: Disponible 24/7 a través del chat
- Documentos requeridos: Licencia de conducir válida, tarjeta de crédito

Mantén las respuestas breves (máximo 2-3 oraciones) y ofrece ayuda adicional cuando sea apropiado.`;

    // Mensaje de bienvenida
    const welcomeMessage = {
      id: messageIdCounter++,
      sender: 'bot',
      text: '¡Hola! 👋 Soy el asistente virtual de IronClad Rentals. Estoy aquí para ayudarte con cualquier consulta sobre el alquiler de vehículos. ¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    };

    // Simular respuesta del bot (en una implementación real, esto sería una llamada a una API de IA)
    const generateBotResponse = async (userMessage) => {
      // Respuestas predefinidas basadas en palabras clave
      const responses = {
        'alquilar|rentar|alquiler': {
          text: 'Para alquilar un vehículo sigue estos pasos:<br/>1. 🔍 Busca vehículos disponibles<br/>2. 📋 Revisa los detalles del vehículo<br/>3. 📅 Selecciona las fechas de inicio y fin<br/>4. 📍 Elige la ubicación de entrega<br/>5. ✅ Confirma tu reserva<br/><br/>¿Necesitas ayuda con algún paso específico?'
        },
        'pago|tarjeta|paypal|precio': {
          text: 'Aceptamos los siguientes métodos de pago:<br/>💳 Tarjetas de crédito (Visa, MasterCard, American Express)<br/>💳 Tarjetas de débito<br/>🔷 PayPal<br/><br/>El pago se procesa de forma segura al confirmar tu reserva. ¿Tienes alguna pregunta específica sobre pagos?'
        },
        'cancelar|cancelación|devolver': {
          text: 'Nuestra política de cancelación es flexible:<br/>✅ Cancelación gratuita hasta 24 horas antes del inicio del alquiler<br/>⚠️ Cancelaciones tardías pueden tener penalizaciones<br/>💰 Los reembolsos se procesan en 3-5 días hábiles<br/><br/>¿Necesitas cancelar una reserva actual?'
        },
        'problema|error|técnico|no funciona': {
          text: 'Lamento que tengas problemas técnicos. Aquí hay algunas soluciones comunes:<br/>🔄 Actualiza la página (F5 o Ctrl+R)<br/>🧹 Limpia la caché del navegador<br/>🔒 Verifica que estés conectado a internet<br/>📱 Intenta desde otro dispositivo<br/><br/>Si el problema persiste, puedo escalar tu caso a soporte técnico avanzado.'
        },
        'cuenta|registro|perfil|configuración': {
          text: 'Para gestionar tu cuenta puedes:<br/>👤 Actualizar tu perfil personal<br/>🔒 Cambiar tu contraseña<br/>📧 Modificar tu email<br/>🚗 Ver tu historial de alquileres<br/>💳 Gestionar métodos de pago<br/><br/>¿Qué aspecto de tu cuenta necesitas ajustar?'
        },
        'ubicación|dirección|mapa|lugar': {
          text: 'Nuestras ubicaciones de entrega están estratégicamente ubicadas:<br/>🏢 Oficinas en centros urbanos<br/>✈️ Aeropuertos principales<br/>🚉 Estaciones de tren<br/>🗺️ Puedes ver todas las ubicaciones en el mapa durante el proceso de reserva<br/><br/>¿Buscas una ubicación específica?'
        },
        'documentos|licencia|identificación': {
          text: 'Para alquilar un vehículo necesitas:<br/>🆔 Licencia de conducir válida y vigente<br/>💳 Tarjeta de crédito a tu nombre<br/>📄 Identificación oficial (INE, pasaporte)<br/>👤 Ser mayor de 21 años<br/><br/>Todos los documentos deben estar en regla al momento de recoger el vehículo.'
        },
        'hola|buenos días|buenas tardes|buenas noches|hi|hello': {
          text: '¡Hola! 😊 Me da mucho gusto saludarte. Estoy aquí para ayudarte con cualquier duda sobre IronClad Rentals. ¿Hay algo específico en lo que pueda asistirte hoy?'
        },
        'gracias|thank you|muchas gracias': {
          text: '¡De nada! 😊 Es un placer poder ayudarte. Si tienes alguna otra consulta, no dudes en preguntarme. ¡Estoy aquí para hacer tu experiencia con IronClad Rentals lo más fácil posible!'
        },
        'adiós|bye|hasta luego|nos vemos': {
          text: '¡Hasta luego! 👋 Ha sido un gusto ayudarte. Recuerda que estoy disponible 24/7 para cualquier consulta. ¡Que tengas un excelente día y disfrutes tu experiencia con IronClad Rentals!'
        }
      };

      // Buscar respuesta basada en palabras clave
      for (const [keywords, response] of Object.entries(responses)) {
        const regex = new RegExp(keywords, 'i');
        if (regex.test(userMessage)) {
          return response.text;
        }
      }

      // Respuesta por defecto
      return 'Entiendo tu consulta. Te puedo ayudar con:<br/>🚗 Proceso de alquiler de vehículos<br/>💳 Información sobre pagos<br/>📋 Políticas y términos<br/>🔧 Problemas técnicos<br/>👤 Gestión de cuenta<br/><br/>¿Podrías ser más específico sobre lo que necesitas?';
    };

    const addMessage = (sender, text) => {
      messages.value.push({
        id: messageIdCounter++,
        sender,
        text,
        timestamp: new Date()
      });
      nextTick(() => {
        scrollToBottom();
      });
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };

    const sendMessage = async () => {
      if (!currentMessage.value.trim() || isTyping.value) return;

      const userMessage = currentMessage.value.trim();
      addMessage('user', userMessage);
      currentMessage.value = '';

      // Simular el bot escribiendo
      isTyping.value = true;
      
      // Simular delay de respuesta (1-2 segundos)
      setTimeout(async () => {
        const botResponse = await generateBotResponse(userMessage);
        addMessage('bot', botResponse);
        isTyping.value = false;
      }, Math.random() * 1000 + 1000);
    };

    const selectQuickAction = (action) => {
      if (isTyping.value) return;
      currentMessage.value = action.text;
      sendMessage();
    };

    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const handleOverlayClick = () => {
      emit('close');
    };

    const handleTyping = () => {
      // Aquí podrías implementar un indicador de "usuario escribiendo"
    };

    // Inicializar con mensaje de bienvenida cuando se abre el chat
    watch(() => props.visible, (newVal) => {
      if (newVal && messages.value.length === 0) {
        messages.value.push(welcomeMessage);
        nextTick(() => {
          scrollToBottom();
        });
      }
    });

    return {
      messages,
      currentMessage,
      isTyping,
      messagesContainer,
      quickActions,
      sendMessage,
      selectQuickAction,
      formatTime,
      handleOverlayClick,
      handleTyping
    };
  }
};
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  z-index: 10000;
  padding: 20px;
}

.chat-container {
  width: 380px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 100px; /* Espacio para el botón flotante */
}

.chat-header {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bot-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.bot-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.bot-status {
  font-size: 12px;
  opacity: 0.9;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8f9fa;
}

.message {
  display: flex;
  align-items: flex-end;
}

.message.user {
  justify-content: flex-end;
}

.message.bot {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  color: white;
  border-bottom-right-radius: 4px;
}

.message.bot .message-content {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.message-time {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 4px;
  display: block;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #bbb;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.chat-input {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 24px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #2e7d32;
}

.message-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.send-btn {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: transform 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quick-action-btn {
  background: #f1f3f4;
  border: 1px solid #dadce0;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.quick-action-btn:hover:not(:disabled) {
  background: #e8f5e8;
  border-color: #2e7d32;
  color: #2e7d32;
}

.quick-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 480px) {
  .chat-container {
    width: calc(100vw - 40px);
    height: calc(100vh - 140px);
    margin-bottom: 20px;
  }
  
  .chat-overlay {
    padding: 10px;
  }
}

/* Scrollbar personalizado */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
