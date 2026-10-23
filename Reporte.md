# Reporte de Solución – Prueba Técnica Angular

**Candidato:** Danilo Andres Pineda Moreno  
**Fecha:** 23/10/2026  
**Repositorio:** https://github.com/daniandre18/epam

---

## 1. Decisiones tomadas

> Para cada decisión relevante, describe qué elegiste y por qué.

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Tipo de formulario | Formulario template-driven con `FormsModule` y `NgForm`. | Es la estrategia que ya utiliza el componente y permite validar campos con atributos y directivas de Angular sin cambiar la estructura existente. |
| Estrategia de filtrado | Filtrado local de los clientes cargados, con `debounceTime(300)` y `distinctUntilChanged()`. | Evita recalcular el filtro por cada tecla y no genera llamadas al servicio/API al escribir. Busca coincidencias en ID, nombre, apellido, correo y teléfono. |
| Manejo del estado de edición inline | Se conserva el ID del cliente en edición y se crea una copia temporal de sus datos. | Permite modificar la fila directamente y guardar los cambios o cancelarlos sin alterar los datos originales antes de confirmar. |
| Otras (librerías, estructura, etc.) | RxJS (`Subject`, `debounceTime`, `distinctUntilChanged`, `map`) y `takeUntilDestroyed` de Angular. | Se aprovechan dependencias existentes. La suscripción del buscador se libera al destruir el componente. |

---

## 2. Problemas encontrados

> Describe los obstáculos que encontraste y cómo los resolviste. Si alguno quedó sin resolver, explica qué intentaste.

El buscador estaba conectado a una búsqueda del servicio por cada cambio del campo. Se reemplazó esa estrategia por un filtro en memoria sobre la lista ya cargada y se agregó una espera de 300 ms desde la última tecla. También se normalizan espacios y mayúsculas/minúsculas, y se omiten términos equivalentes consecutivos.

La persistencia actual del servicio se realiza con `localStorage`; por tanto, en esta versión las operaciones no corresponden a llamadas HTTP reales. Quedó pendiente completar el indicador de carga y unificar los errores para que siempre se presenten visiblemente en pantalla. La ejecución de build y pruebas automatizadas no quedó confirmada.

---

## 3. Resultado

| # | Tarea | Estado |
|---|-------|--------|
| 1 | Validación de campos y marcado visual | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 2 | Limpiar formulario al guardar | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 3 | Campo Email con validación de formato | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 4 | Validación numérica del teléfono | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 5 | Eliminar cliente | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 6 | Edición inline | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 7 | Buscador en tiempo real | ☑ Completada · ☐ Parcial · ☐ No realizada |
| 8 | Spinner y manejo de errores | ☐ Completada · ☑ Parcial · ☐ No realizada |

Las tareas 1 a 7 están implementadas en la interfaz. En la tarea 8 se muestran algunos errores de edición y eliminación, pero falta un indicador de carga y la presentación visible y consistente de errores para todas las operaciones.

---

## 4. Uso de herramientas de IA

> Si utilizaste alguna herramienta de IA (ChatGPT, GitHub Copilot, etc.), indícalo aquí. Describe qué usaste, para qué y cómo influyó en tu solución.

Utilicé GitHub Copilot para recibir asistencia al revisar el buscador y preparar la documentación de la solución. La implementación se mantuvo en los archivos del componente y su plantilla, y se revisó el comportamiento para filtrar localmente sin solicitar datos al servicio mientras se escribe.

También para que me ayudara a subir al repo de GitHub y documentación 

---

## 5. Mejoras propuestas

> Si tuvieras más tiempo, ¿qué mejorarías o agregarías?

Integraría el servicio con la API real, añadiría un indicador de carga y mensajes de error accesibles y consistentes para cada operación, y agregaría pruebas unitarias para validaciones, filtrado con debounce y acciones CRUD. También mejoraría la accesibilidad de la tabla y confirmaría el comportamiento con una compilación y la suite de pruebas.
