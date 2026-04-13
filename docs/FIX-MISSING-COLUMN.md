# Instrucciones para agregar columna missing

## Problema
La tabla `quiz_attempts` no tiene la columna `completed_at` que el código espera.

## Solución

Ejecutar este SQL en **Supabase Dashboard > SQL Editor**:

```sql
ALTER TABLE quiz_attempts ADD COLUMN IF NOT EXISTS completed_at BIGINT;
```

## Verificar

Después de ejecutar, verificar con:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts';
```

Debería mostrar `completed_at` con tipo `bigint`.