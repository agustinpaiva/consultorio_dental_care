@AGENTS.md

# Guías de desarrollo

## Simplicidad
- Preferir la solución más simple que funcione.
- No agregar abstracciones hasta que exista una necesidad real.
- No optimizar prematuramente.

## Arquitectura
- Mantener responsabilidades separadas.
- La lógica de negocio no debe mezclarse con la interfaz.
- Evitar archivos excesivamente grandes.
- Si un archivo supera aproximadamente 300-500 líneas, evaluar dividirlo.

## Dependencias
- No agregar librerías sin explicar qué problema resuelven.
- Preferir las capacidades nativas del framework cuando sean suficientes.
- Minimizar dependencias externas.

## Calidad
- Detectar código duplicado y proponer refactorización.
- Identificar deuda técnica cuando aparezca.
- Señalar posibles problemas de rendimiento o seguridad.
- Mantener nombres claros y descriptivos.

## Escalabilidad
- Diseñar pensando en que el proyecto pueda crecer.
- Evitar patrones enterprise hasta que sean necesarios.
- Introducir complejidad únicamente cuando resuelva un problema real.

## Cambios
- Antes de cambios importantes, proponer un plan breve.
- Explicar ventajas y desventajas de cada alternativa.
- Mantener consistencia con la estructura existente.

## Enseñanza
- Explicar decisiones técnicas importantes.
- Si existe una práctica recomendada, explicar el motivo.
- Priorizar claridad y mantenibilidad sobre sofisticación.
