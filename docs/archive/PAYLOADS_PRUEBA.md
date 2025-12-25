# 🧪 Payloads de Prueba para Postman

Usa estos JSON para probar tu Webhook de N8N desde Postman. Cada ejemplo simula un tipo de evento diferente con datos realistas.

---

## Configuración en Postman

1. **Método:** `POST`
2. **URL:** `https://erjgomezf.app.n8n.cloud/webhook-test/streaming-service`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body:** Selecciona `raw` → `JSON` y pega uno de los ejemplos de abajo.

---

## 📋 Ejemplo 1: Evento Social (Boda) - Urgencia Alta

```json
{
  "tipo_evento": "Eventos sociales",
  "fecha_evento": "2025-12-01",
  "ubicacion_evento": "Hacienda El Paraíso, Caracas",
  "duracion_estimada": "6 horas",
  "tiene_internet_venue": "No",
  "paquete_interes": "Premium",
  "nombre_cliente": "María González",
  "email_cliente": "maria.gonzalez@email.com",
  "telefono_cliente": "+58 412 9876543",
  "comentarios_adicionales": "Es una boda al aire libre, necesitamos cobertura de la ceremonia y la recepción. Queremos transmitir en vivo para familiares en el exterior.",
  "add_ons_solicitados": ["Internet Starlink", "Overlays Personalizados"],
  "tipo_celebracion": "Boda",
  "numero_invitados": 150,
  "momentos_clave": ["Ceremonia", "Entrada de novios", "Baile", "Brindis"],
  "timestamp": "2025-12-26T14:05:00.000Z"
}
```

---

## 🏢 Ejemplo 2: Evento Corporativo - Urgencia Media

```json
{
  "tipo_evento": "Conferencias y eventos corporativos",
  "fecha_evento": "2025-12-20",
  "ubicacion_evento": "Centro de Convenciones, Valencia",
  "duracion_estimada": "4 horas",
  "tiene_internet_venue": "Sí",
  "paquete_interes": "Enterprise",
  "nombre_cliente": "Carlos Ramírez",
  "email_cliente": "cramírez@empresaxyz.com",
  "telefono_cliente": "+58 424 1234567",
  "comentarios_adicionales": "Lanzamiento de producto para 300 personas. Necesitamos streaming a YouTube y LinkedIn simultáneamente.",
  "add_ons_solicitados": ["Plataforma Adicional", "Overlays Personalizados"],
  "nombre_empresa": "Empresa XYZ C.A.",
  "tipo_conferencia": "Lanzamiento de producto",
  "numero_speakers": 3,
  "numero_asistentes": 300,
  "necesita_grabacion": "Sí",
  "plataformas_destino": ["YouTube", "LinkedIn"],
  "timestamp": "2025-12-26T14:10:00.000Z"
}
```

---

## 🎮 Ejemplo 3: E-Sports - Urgencia Normal

```json
{
  "tipo_evento": "E-Sport y Gaming",
  "fecha_evento": "2026-02-15",
  "ubicacion_evento": "Gaming Arena, Maracaibo",
  "duracion_estimada": "8 horas",
  "tiene_internet_venue": "Sí",
  "paquete_interes": "Estándar",
  "nombre_cliente": "Luis Fernández",
  "email_cliente": "luis.fernandez@gmail.com",
  "telefono_cliente": "+58 414 5556677",
  "comentarios_adicionales": "Torneo local de League of Legends. Queremos scoreboards en tiempo real y comentaristas.",
  "add_ons_solicitados": ["Cámara + Micrófono Adicional"],
  "juego_plataforma": "League of Legends",
  "tipo_torneo": "Local",
  "numero_equipos": 8,
  "numero_jugadores": 40,
  "necesita_scoreboards": "Sí",
  "necesita_comentaristas": "Sí",
  "plataformas_destino": ["Twitch", "YouTube"],
  "timestamp": "2025-12-26T14:15:00.000Z"
}
```

---

## 🎵 Ejemplo 4: Concierto - Urgencia Alta (Menos de 7 días)

```json
{
  "tipo_evento": "Conciertos y Eventos Artísticos",
  "fecha_evento": "2025-12-02",
  "ubicacion_evento": "Teatro Nacional, Caracas",
  "duracion_estimada": "2 horas",
  "tiene_internet_venue": "No estoy seguro",
  "paquete_interes": "Premium",
  "nombre_cliente": "Ana Pérez",
  "email_cliente": "ana.perez@produccionesmusic.com",
  "telefono_cliente": "+58 426 7778899",
  "comentarios_adicionales": "Concierto de música clásica. Necesitamos audio de alta calidad y múltiples ángulos.",
  "add_ons_solicitados": ["Internet Starlink", "Cámara + Micrófono Adicional"],
  "tipo_evento_artistico": "Concierto",
  "nombre_artista": "Orquesta Sinfónica Nacional",
  "numero_artistas": 50,
  "tipo_venue": "Teatro",
  "necesita_audio_profesional": "Sí",
  "timestamp": "2025-12-26T14:20:00.000Z"
}
```

---

## ⛪ Ejemplo 5: Evento Religioso - Urgencia Normal

```json
{
  "tipo_evento": "Eventos Religiosos",
  "fecha_evento": "2026-01-10",
  "ubicacion_evento": "Iglesia San José, Barquisimeto",
  "duracion_estimada": "2 horas",
  "tiene_internet_venue": "Sí",
  "paquete_interes": "Básico",
  "nombre_cliente": "Padre José Martínez",
  "email_cliente": "padre.jose@iglesiasj.org",
  "telefono_cliente": "+58 412 3334455",
  "comentarios_adicionales": "Misa dominical para transmitir a la comunidad que no puede asistir presencialmente.",
  "add_ons_solicitados": [],
  "tipo_ceremonia": "Misa",
  "numero_asistentes": 200,
  "necesita_audio_claro": "Sí",
  "timestamp": "2025-12-26T14:25:00.000Z"
}
```

---

## ⚽ Ejemplo 6: Evento Deportivo - Urgencia Media

```json
{
  "tipo_evento": "Eventos Deportivos",
  "fecha_evento": "2025-12-28",
  "ubicacion_evento": "Estadio Municipal, Mérida",
  "duracion_estimada": "Todo el día",
  "tiene_internet_venue": "No",
  "paquete_interes": "Enterprise",
  "nombre_cliente": "Roberto Sánchez",
  "email_cliente": "roberto.sanchez@ligafutbol.com",
  "telefono_cliente": "+58 424 9998877",
  "comentarios_adicionales": "Torneo de fútbol con 4 partidos. Necesitamos scoreboards, replays y transmisión a 3 plataformas.",
  "add_ons_solicitados": ["Internet Starlink", "Plataforma Adicional", "Cámara + Micrófono Adicional"],
  "tipo_deporte": "Fútbol",
  "tipo_evento_deportivo": "Torneo",
  "numero_equipos": 8,
  "necesita_scoreboards": "Sí",
  "necesita_replays": "Sí",
  "tipo_venue_deportivo": "Estadio",
  "timestamp": "2025-12-26T14:30:00.000Z"
}
```

---

## 🧪 Caso de Prueba: Datos Incompletos (Para validación de errores)

```json
{
  "tipo_evento": "Eventos sociales",
  "fecha_evento": "2025-12-15",
  "ubicacion_evento": "",
  "duracion_estimada": "4 horas",
  "tiene_internet_venue": "Sí",
  "paquete_interes": "Estándar",
  "nombre_cliente": "AB",
  "email_cliente": "correo-invalido",
  "telefono_cliente": "123",
  "comentarios_adicionales": "",
  "add_ons_solicitados": [],
  "timestamp": "2025-12-26T14:35:00.000Z"
}
```

---

## 📊 Qué Esperar en N8N

Después de enviar cada payload, tu workflow debería:

1. ✅ **Recibir los datos** en el nodo Webhook
2. ✅ **Calcular días restantes** (ej: 5 días para el Ejemplo 4)
3. ✅ **Clasificar urgencia:**
   - Ejemplo 1: 🔴 ALTA (Premium)
   - Ejemplo 2: 🔴 ALTA (Enterprise)
   - Ejemplo 3: 🟢 Normal (más de 30 días)
   - Ejemplo 4: 🔴 ALTA (menos de 7 días)
4. ✅ **Validar datos** (el último ejemplo debería fallar)

¡Usa estos payloads para probar cada rama de tu workflow! 🚀
