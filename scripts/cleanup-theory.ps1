$f = "c:\Users\kiri_\Documents\Codex\2026-08-02\referenced-chatgpt-conversation-this-is-an\content\lesson-theory.ts"
$lines = Get-Content $f -Encoding UTF8
# Keep lines 1-21 (index 0-20) and lines 190-end (index 189+)
$keep = $lines[0..20] + $lines[189..($lines.Length - 1)]
Set-Content -Path $f -Value $keep -Encoding UTF8
Write-Host "Done. Kept $($keep.Length) lines out of $($lines.Length)"
