@echo off
REM Format Prisma schema

echo Formatting Prisma schema...
call npx prisma format

if %ERRORLEVEL% EQU 0 (
    echo ✅ Prisma schema formatted successfully
    echo.
    echo Please check if there are changes and commit them:
    echo    git add prisma/schema.prisma
    echo    git commit -m "Format Prisma schema"
    echo    git push
) else (
    echo ❌ Prisma format failed
    exit /b 1
)

