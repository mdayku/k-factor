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

## PATH Diagnostics

### `check-path.ps1` (Windows PowerShell)

Diagnoses PATH environment variable issues and identifies missing tools (git, node, npm, pnpm).

**Usage:**
```powershell
powershell -ExecutionPolicy Bypass -File scripts/check-path.ps1
```

**What it checks:**
- ✅ Tests if git, node, npm, pnpm are accessible
- 🔍 Finds where they're installed (even if not in PATH)
- 📋 Shows current PATH contents
- 💡 Provides specific paths to add to your environment variables
- 🔄 Gives quick reload command for current session

**When to use:**
- You see "The term 'git' is not recognized..." errors
- You see "The term 'pnpm' is not recognized..." errors
- Commands work in one terminal but not another
- After installing new tools that aren't being found

**Output example:**
```
1. Testing Command Availability:
  ✅ node found at: C:\Program Files\nodejs\node.exe
  ❌ git NOT accessible from PATH
     But found installed at: C:\Program Files\Git\bin

2. Current PATH Contents:
  Relevant paths currently in PATH:
    - C:\Program Files\nodejs

3. Recommendations:
  ⚠️  Add these paths to your environment variables:
    - C:\Program Files\Git\bin (for git)
```

**To permanently fix PATH issues:**
1. Run the diagnostic script to identify missing paths
2. Press `Win + X`, select "System"
3. Click "Advanced system settings"
4. Click "Environment Variables"
5. Under "User variables", select "Path" and click "Edit"
6. Click "New" and add each missing path
7. Click "OK" on all dialogs
8. Restart PowerShell/Terminal

**Quick fix for current session only:**
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

