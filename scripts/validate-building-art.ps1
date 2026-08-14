param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string[]]$Paths,
  [int]$ExpectedWidth = 512,
  [int]$ExpectedHeight = 512,
  [int]$MinimumTransparentMargin = 2
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$results = foreach ($inputPath in $Paths) {
  $resolved = Resolve-Path -LiteralPath $inputPath
  $bitmap = [System.Drawing.Bitmap]::FromFile($resolved.Path)
  try {
    $minX = $bitmap.Width
    $minY = $bitmap.Height
    $maxX = -1
    $maxY = -1
    $opaquePixels = 0

    for ($y = 0; $y -lt $bitmap.Height; $y++) {
      for ($x = 0; $x -lt $bitmap.Width; $x++) {
        if ($bitmap.GetPixel($x, $y).A -gt 5) {
          $opaquePixels++
          if ($x -lt $minX) { $minX = $x }
          if ($y -lt $minY) { $minY = $y }
          if ($x -gt $maxX) { $maxX = $x }
          if ($y -gt $maxY) { $maxY = $y }
        }
      }
    }

    $hasContent = $opaquePixels -gt 0
    $margins = if ($hasContent) {
      [ordered]@{
        left = $minX
        top = $minY
        right = $bitmap.Width - 1 - $maxX
        bottom = $bitmap.Height - 1 - $maxY
      }
    } else {
      [ordered]@{ left = 0; top = 0; right = 0; bottom = 0 }
    }

    $sizeOk = $bitmap.Width -eq $ExpectedWidth -and $bitmap.Height -eq $ExpectedHeight
    $marginOk = $hasContent -and ($margins.Values | Where-Object { $_ -lt $MinimumTransparentMargin }).Count -eq 0
    [pscustomobject]@{
      file = $resolved.Path
      width = $bitmap.Width
      height = $bitmap.Height
      hasAlpha = [System.Drawing.Image]::IsAlphaPixelFormat($bitmap.PixelFormat)
      opaquePixels = $opaquePixels
      contentBounds = if ($hasContent) { [ordered]@{ x = $minX; y = $minY; width = $maxX - $minX + 1; height = $maxY - $minY + 1 } } else { $null }
      transparentMargins = $margins
      sizeOk = $sizeOk
      marginOk = $marginOk
      passed = $sizeOk -and $bitmap.RawFormat.Guid -eq [System.Drawing.Imaging.ImageFormat]::Png.Guid -and [System.Drawing.Image]::IsAlphaPixelFormat($bitmap.PixelFormat) -and $marginOk
    }
  } finally {
    $bitmap.Dispose()
  }
}

$results | ConvertTo-Json -Depth 5
if (($results | Where-Object { -not $_.passed }).Count -gt 0) { exit 1 }

