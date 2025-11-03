# Development Scripts

Utility scripts for common development tasks.

## Prisma Formatting

### `format-prisma.bat` (Windows) / `format-prisma.sh` (Linux/Mac)

Formats the Prisma schema file according to Prisma's formatting standards.

**Usage (Windows):**
```bash
scripts\format-prisma.bat
```

**Usage (Linux/Mac):**
```bash
chmod +x scripts/format-prisma.sh
./scripts/format-prisma.sh
```

**Or run directly:**
```bash
npx prisma format
```

After formatting, if there are changes:
```bash
git add prisma/schema.prisma
git commit -m "Format Prisma schema"
git push
```

**Note:** The CI pipeline runs `npx prisma format --check` which will fail if the schema is not properly formatted. Always run `npx prisma format` before committing changes to the Prisma schema.

## Common Issues

### "There are unformatted files" Error in CI

**Cause:** The Prisma schema hasn't been formatted with `npx prisma format`

**Solution:**
1. Run `npx prisma format` locally
2. Commit the formatted file
3. Push to trigger CI again

The format check ensures consistency across the team and prevents formatting conflicts.

