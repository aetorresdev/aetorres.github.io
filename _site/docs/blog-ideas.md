# Blog post ideas (TODO)

Ideas de artículos para el blog, con enfoque práctico y ejemplos de código.

---

## Prioridad sugerida

1. **Hadolint + Trivy en CI** – Validación y seguridad de imágenes Docker en el pipeline. Corto, muy práctico.
2. **Configuración óptima de OpenTelemetry (OTEL)** – Collector, sampling, ejemplos YAML y uso en producción.
3. **Jenkins automation (patrones genéricos)** – Basado en experiencia sin datos de cliente: patrones, arquitectura anonimizada, ejemplos con nombres genéricos (ej. `acme-app`).
4. **GitOps con Argo CD o Flux** – Flujo completo: repo de manifiestos, promoción entre entornos, ejemplo de Application/HelmRelease.

---

## Más temas posibles

- Terraform en CI: validate, fmt, checkov/tfsec, plan en PR.
- GitHub Actions: workflows reutilizables, matriz, cache.
- Observabilidad “en casa”: OTEL → Prometheus + Grafana (sin SaaS).
- Packer + AMI para agentes (Jenkins u otro): build y uso en ASG.
- Uso de MCP (Model Context Protocol): configuración y un ejemplo de tool call.
- N8N en DevOps: flujo de notificaciones o tickets ante fallos de deploy.

---

## Notas para el artículo de Jenkins

- Enfoque: problema + patrón, sin nombre de cliente.
- Código con nombres genéricos (`example-service`, `jenkins-main`, `agent-pool`).
- Arquitectura anonimizada: “N masters por equipo, agentes en ECS/EKS, state en S3”.
- No incluir: nombres de cliente, dominios internos, IDs de cuenta AWS.
