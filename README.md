# Prueba de Carga – Servicio de Login

## 1. Descripción
Este proyecto presenta la implementación de una prueba de carga sobre un servicio de autenticación (login), utilizando la herramienta k6.

El objetivo es evaluar el comportamiento del sistema bajo condiciones de carga progresiva, analizando tiempos de respuesta, tasa de errores y capacidad de procesamiento. La prueba simula múltiples usuarios concurrentes realizando solicitudes de autenticación, con el fin de aproximarse a un escenario real de uso.

---

## 2. Tecnologías utilizadas

- k6 → Generación de carga  
- InfluxDB v1.8 → Almacenamiento de métricas  
- Grafana → Visualización de datos  
- Docker Desktop → Ejecución de servicios  

---

## 3. Estructura del proyecto

k6-login-test/

├── scripts/  
│   └── login-test.js  
│  
├── data/  
│   └── users.csv  
│  
├── results/  
│   ├── textSummary.txt  
│   └── conclusiones.txt  
│  
└── README.md  

---

## 4. Configuración del entorno

### 4.1 Levantar InfluxDB
docker run -d -p 8086:8086 influxdb:1.8

### 4.2 Levantar Grafana
docker run -d -p 3000:3000 grafana/grafana

---

## 5. Ejecución de la prueba

Ubicado en la raíz del proyecto:

k6 run scripts/login-test.js --out influxdb=http://localhost:8086/k6

---

## 6. Escenario de prueba

- Tipo de carga: Incremento progresivo (ramping-arrival-rate)  
- Duración total: 10 minutos  
- TPS objetivo: hasta 20 iteraciones por segundo  
- Usuarios virtuales máximos: 20  
- Comportamiento: incremento gradual de carga hasta estabilización  

Este enfoque permite observar el comportamiento del sistema a medida que aumenta la demanda, evitando picos abruptos y facilitando el análisis del rendimiento.

---

## 7. Thresholds definidos

- Tiempo de respuesta (p95): < 1500 ms  
- Tasa de error: < 3%  

Estos valores fueron definidos como criterios de aceptación para evaluar el comportamiento del sistema.

---

## 8. Resultados obtenidos

- Total de requests: 7320  
- Requests por segundo: ~12.18  
- Tiempo promedio: 346 ms  
- Percentil 95: 372 ms  
- Tasa de error: 83.21%  

---

## 9. Análisis general

Los resultados muestran que el sistema mantiene tiempos de respuesta estables y dentro de los límites definidos, incluso bajo condiciones de carga progresiva.

Sin embargo, se evidencia una alta tasa de errores durante la ejecución. Este comportamiento sugiere que, aunque el sistema responde de forma rápida, no todas las solicitudes son procesadas correctamente.

Adicionalmente, el sistema no logra sostener completamente el objetivo de 20 TPS, estabilizándose en un valor inferior.

Este tipo de comportamiento es común en servicios de autenticación cuando:
- Se utilizan credenciales no válidas
- Existen validaciones estrictas en el backend
- Se aplican mecanismos de control como rate limiting

---

## 10. Evaluación frente a criterios

| Métrica               | Resultado | Evaluación |
|----------------------|----------|------------|
| Tiempo de respuesta  | Dentro del umbral | Cumple |
| Tasa de error        | Superior al umbral | No cumple |
| TPS objetivo         | Parcialmente alcanzado | Parcial |

---

## 11. Observaciones

- El sistema presenta estabilidad en tiempos de respuesta.
- Se evidencia un incremento progresivo adecuado de carga.
- La tasa de errores es el principal factor a analizar.
- El comportamiento observado puede estar influenciado por la validez de las credenciales utilizadas.

---

## 12. Próximos pasos

Con el fin de obtener una evaluación más precisa del comportamiento del sistema, se propone:

- Ejecutar una prueba adicional utilizando únicamente credenciales válidas.
- Comparar los resultados entre ambos escenarios.
- Analizar logs del backend para identificar causas de error.
- Evaluar el comportamiento bajo distintos niveles de carga.

---

## 13. Acceso a Grafana

URL: http://localhost:3000  
Usuario: admin  
Contraseña: admin  

### Configuración del Data Source

- URL: http://localhost:8086  
- Database: k6  

---

## 14. Visualización de métricas

Las métricas pueden visualizarse en Grafana a través de:

- Explore (consulta directa)
- Dashboards personalizados

Se recomienda analizar las siguientes métricas:

- http_req_duration → Tiempo de respuesta  
- http_reqs → Requests por segundo  
- http_req_failed → Tasa de errores  
- vus → Usuarios virtuales  

---

## 15. Reproducibilidad

Para replicar la prueba:

1. Levantar InfluxDB  
2. Levantar Grafana  
3. Ejecutar el script de k6  
4. Configurar el Data Source en Grafana  
5. Visualizar las métricas  

Este flujo permite reproducir completamente el escenario de prueba y validar los resultados obtenidos.