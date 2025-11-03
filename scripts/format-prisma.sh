#!/bin/bash
# Format Prisma schema and check for changes

echo "Formatting Prisma schema..."
npx prisma format

if [ $? -eq 0 ]; then
  echo "✅ Prisma schema formatted successfully"
  
  # Check if there are changes
  if git diff --quiet prisma/schema.prisma; then
    echo "✅ No formatting changes needed"
  else
    echo "⚠️  Schema was reformatted. Please commit the changes:"
    echo "   git add prisma/schema.prisma"
    echo "   git commit -m 'Format Prisma schema'"
  fi
else
  echo "❌ Prisma format failed"
  exit 1
fi

