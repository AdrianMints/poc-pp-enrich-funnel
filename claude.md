# Presta Prenda POC - Bitacora de Cambios y Estado Final

Este documento concentra todo lo que se corrigio y ajusto desde el inicio de la sesion para conservar contexto y evitar perder decisiones del flujo.

## 1) Objetivo del POC

Construir un flujo guiado para enriquecer catalogo de prendas con:
- Seleccion de SKU pendiente
- Captura guiada de 4 fotos
- Validacion simulada de calidad de fotos
- Generacion y regeneracion asistida (imagenes, titulo, descripcion)
- Revision final y publicacion

## 2) Cambios implementados por orden funcional

### A. Buscador de prendas pendientes (Paso inicial)
- Se corrigio el filtro para evitar resultados irrelevantes por substring.
- Ahora usa:
  - Normalizacion de texto (acentos, minusculas)
  - Prefijo en SKU
  - Prefijo por palabra en titulo
- Resultado: consultas cortas como "cad" ya no arrastran coincidencias no deseadas por aparicion interna.

### B. Regeneracion en revision
- Se agrego prompt para guiar regeneracion.
- Se agregaron controles:
  - Regenerar 4 variantes
  - Regenerar una variante individual
- Se reordeno layout para dejar claro: prompt -> fotos -> accion de regenerar.

### C. Regeneracion de titulo y descripcion
- Se agregaron botones de regenerar en ambos campos.
- Regeneran texto usando contexto de prompt, categoria y SKU.

### D. Gating de botones por prompt
- Botones de regeneracion de imagen se deshabilitan si el prompt esta vacio.
- Se limpian estados iniciales para evitar aparentar accion disponible sin input.

### E. Preview de imagen en modal
- Click en variante abre vista completa.
- Cierre por X, backdrop o tecla Escape.

### F. Sesion de fotos por SKU + borrado por miniatura
- Se corrigio persistencia indebida entre SKUs.
- Se agrego reseteo de fotos cuando cambia SKU activo.
- Se agrego boton de eliminar por miniatura.
- Se corrigio bug de borrado (eliminaba la ultima en vez de la clickeada) usando currentTarget.

### G. Captura sin auto-avance
- Se elimino avance automatico al completar la cuarta foto.
- Usuario revisa/borra y luego presiona Continuar manualmente.

### H. Referencias de captura por paso
- Se cambio de referencia unica a 4 referencias especificas:
  1. Frontal completa
  2. Perfil lateral
  3. Acercamiento detalle
  4. Sello o cierre
- Flujo visual actual:
  - El paso activo se muestra en grande con imagen de referencia + instrucciones.
  - Los demas pasos quedan compactos (numero y titulo).
  - Al capturar, el paso actual se contrae y se expande el siguiente.

### I. Validacion simulada de calidad
- Al completar 4 fotos, se corre verificacion simulada con retardo de 1 segundo.
- Mensaje intermedio: "analizando...".
- Primera verificacion rechaza foto 2 (desenfocada) y obliga recaptura.
- Tras recaptura, segunda verificacion aprueba.
- Continuar solo se habilita con 4 fotos validas y sin verificacion en curso.

### J. Regeneracion de fotos: misma base con variacion sutil
- En revision, la regeneracion ahora parte de la imagen actual (no desde cero).
- Se aplican micro-ajustes en canvas (brillo/contraste/saturacion/rotacion/zoom/desplazamiento/temperatura leve).
- Objetivo: mantener "la misma foto" con cambios ligeros.

## 3) Estado final esperado del Paso 3 (captura)

1. Antes de capturar:
- Paso 1 grande (referencia + instrucciones).
- Pasos 2-4 compactos.

2. Tras foto 1:
- Paso 1 compacto.
- Paso 2 grande.

3. Tras foto 2:
- Paso 3 grande.

4. Tras foto 3:
- Paso 4 grande.

5. Tras foto 4:
- Verificacion IA (1 segundo).
- Rechazo forzado de foto 2.
- Recaptura foto 2.
- Nueva verificacion y aprobacion.
- Continuar habilitado.

## 4) Archivos impactados

- prestaprenda-enrich/index.html
  - Logica de busqueda y filtrado en pendientes.

- prestaprenda-enrich/photos.html
  - Flujo de captura, referencias por paso, validacion simulada, control de avance.

- prestaprenda-enrich/review.html
  - Regeneracion por prompt, modal preview, regen individual/masivo, regeneracion sutil sobre misma imagen.

- prestaprenda-enrich/css/components.css
  - Estados visuales de botones, modal, referencias de captura, miniaturas, avisos de calidad.

## 5) Criterios de aceptacion vigentes

- Busqueda no devuelve coincidencias irrelevantes por substring interna.
- Regeneracion de imagen solo activa con prompt.
- Se puede regenerar 1 o 4 variantes.
- Regenerar conserva base visual (cambio sutil).
- Captura no navega sola al terminar 4 fotos.
- Existe borrado por miniatura y elimina la correcta.
- Paso activo de referencia se muestra en grande; restantes compactos.
- Verificacion IA tarda 1 segundo y rechaza foto 2 en primera pasada.

## 6) Notas para siguientes iteraciones

- Si se agregan imagenes reales de referencia, reemplazar generacion SVG por assets locales por tipo de prenda.
- Si se conecta backend IA real, mantener el contrato UX actual (pasos, estados, bloqueos, mensajes).
- No reintroducir auto-avance despues de la cuarta foto.

## 7) Changelog corto (resumen ejecutivo)

- Search: fixed (prefijos + normalizacion)
- Review: regen por prompt (1/4) + titulo/descripcion + modal
- Photos: reset por SKU + delete por miniatura + bug fix click target
- Capture: sin auto-avance
- Guide: paso activo grande, restantes compactos
- QA sim: 1s de verificacion, falla foto 2, recaptura, aprobacion
- Image regen: misma base con variacion leve
