# PowerShell script to diagnose PATH issues
# Run with: powershell -ExecutionPolicy Bypass -File scripts/check-path.ps1

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "PATH Diagnostic Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Function to find installation path
function Find-InstallPath {
    param($Executable, $CommonPaths)
    
    foreach ($path in $CommonPaths) {
        $fullPath = Join-Path $path $Executable
        if (Test-Path $fullPath) {
            return $path
        }
    }
    return $null
}

Write-Host "`n1. Testing Command Availability:" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

$commands = @{
    "git" = @("C:\Program Files\Git\bin", "C:\Program Files\Git\cmd")
    "node" = @("C:\Program Files\nodejs", "$env:ProgramFiles\nodejs", "${env:ProgramFiles(x86)}\nodejs")
    "npm" = @("C:\Program Files\nodejs", "$env:ProgramFiles\nodejs", "${env:ProgramFiles(x86)}\nodejs")
    "pnpm" = @("$env:APPDATA\npm", "$env:LOCALAPPDATA\pnpm", "C:\Program Files\nodejs")
}

$missing = @()

foreach ($cmd in $commands.Keys) {
    $executable = if ($cmd -eq "git") { "git.exe" } elseif ($cmd -eq "pnpm") { "pnpm.cmd" } else { "$cmd.exe" }
    
    if (Test-Command $cmd) {
        $location = (Get-Command $cmd).Source
        Write-Host "  ✅ $cmd found at: $location" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $cmd NOT accessible from PATH" -ForegroundColor Red
        
        # Try to find where it's installed
        $foundPath = Find-InstallPath $executable $commands[$cmd]
        if ($foundPath) {
            Write-Host "     But found installed at: $foundPath" -ForegroundColor Yellow
            $missing += @{Command = $cmd; Path = $foundPath}
        } else {
            Write-Host "     Not found in common locations - may not be installed" -ForegroundColor Red
        }
    }
}

Write-Host "`n2. Current PATH Contents:" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

$currentPath = $env:Path -split ';'
$relevantPaths = $currentPath | Where-Object { 
    $_ -match 'Git|nodejs|npm|pnpm' 
}

if ($relevantPaths) {
    Write-Host "  Relevant paths currently in PATH:" -ForegroundColor Green
    $relevantPaths | ForEach-Object {
        Write-Host "    - $_" -ForegroundColor Cyan
    }
} else {
    Write-Host "  No Git/Node/npm/pnpm paths found in current PATH" -ForegroundColor Red
}

Write-Host "`n3. System vs User PATH:" -ForegroundColor Yellow
Write-Host "=======================" -ForegroundColor Yellow

$systemPath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "  System PATH entries: $($systemPath -split ';' | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Cyan
Write-Host "  User PATH entries: $($userPath -split ';' | Measure-Object | Select-Object -ExpandProperty Count)" -ForegroundColor Cyan

Write-Host "`n4. Recommendations:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

if ($missing.Count -gt 0) {
    Write-Host "  WARNING: Add these paths to your environment variables:" -ForegroundColor Yellow
    foreach ($item in $missing) {
        Write-Host "    - $($item.Path) (for $($item.Command))" -ForegroundColor Cyan
    }
    
    Write-Host "`n  Steps to add to PATH:" -ForegroundColor Green
    Write-Host "    1. Press Win + X, select System" -ForegroundColor White
    Write-Host "    2. Click Advanced system settings" -ForegroundColor White
    Write-Host "    3. Click Environment Variables" -ForegroundColor White
    Write-Host "    4. Under User variables, select Path and click Edit" -ForegroundColor White
    Write-Host "    5. Click New and add each path listed above" -ForegroundColor White
    Write-Host "    6. Click OK on all dialogs" -ForegroundColor White
    Write-Host "    7. Restart PowerShell/Terminal" -ForegroundColor White
} else {
    Write-Host "  SUCCESS: All tools are accessible! No PATH changes needed." -ForegroundColor Green
    Write-Host "  If you still see errors, try restarting your terminal." -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Diagnostic Complete!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

