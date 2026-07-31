param(
  [string]$SourceDir = (Join-Path $PSScriptRoot '..\art-source\v06-icons'),
  [string]$OutputDir = (Join-Path $PSScriptRoot '..\art-source\v06-icons\review')
)

Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

function Export-UiIcon {
  param(
    [string]$SourcePath,
    [string]$OutputPath
  )

  $source = [System.Drawing.Bitmap]::new($SourcePath)
  $workingSize = 192
  $working = [System.Drawing.Bitmap]::new(
    $workingSize,
    $workingSize,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $graphics = [System.Drawing.Graphics]::FromImage($working)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, $workingSize, $workingSize))
  $graphics.Dispose()
  $source.Dispose()

  $minX = $workingSize
  $minY = $workingSize
  $maxX = -1
  $maxY = -1
  for ($y = 0; $y -lt $workingSize; $y++) {
    for ($x = 0; $x -lt $workingSize; $x++) {
      $pixel = $working.GetPixel($x, $y)
      $isKey = $pixel.R -gt 180 -and $pixel.B -gt 180 -and $pixel.G -lt 165 `
        -and ($pixel.R - $pixel.G) -gt 55 -and ($pixel.B - $pixel.G) -gt 55
      if ($isKey) {
        $working.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        continue
      }
      if ($pixel.A -eq 0) { continue }
      if ($x -lt $minX) { $minX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -gt $maxY) { $maxY = $y }
    }
  }

  if ($maxX -lt $minX -or $maxY -lt $minY) {
    $working.Dispose()
    throw "No icon pixels found in $SourcePath"
  }

  $sourceWidth = $maxX - $minX + 1
  $sourceHeight = $maxY - $minY + 1
  $targetSize = 32
  $padding = 2
  $maxDraw = $targetSize - $padding * 2
  $scale = [Math]::Min($maxDraw / $sourceWidth, $maxDraw / $sourceHeight)
  $drawWidth = [Math]::Max(1, [int][Math]::Floor($sourceWidth * $scale))
  $drawHeight = [Math]::Max(1, [int][Math]::Floor($sourceHeight * $scale))
  $drawX = [int](($targetSize - $drawWidth) / 2)
  $drawY = [int](($targetSize - $drawHeight) / 2)

  $output = [System.Drawing.Bitmap]::new(
    $targetSize,
    $targetSize,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $outputGraphics = [System.Drawing.Graphics]::FromImage($output)
  $outputGraphics.Clear([System.Drawing.Color]::Transparent)
  $outputGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $outputGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $outputGraphics.DrawImage(
    $working,
    [System.Drawing.Rectangle]::new($drawX, $drawY, $drawWidth, $drawHeight),
    [System.Drawing.Rectangle]::new($minX, $minY, $sourceWidth, $sourceHeight),
    [System.Drawing.GraphicsUnit]::Pixel
  )
  $outputGraphics.Dispose()
  $working.Dispose()
  $output.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $output.Dispose()
}

$icons = @(
  @{ Id = 'recruit'; Label = 'RECRUIT'; Source = 'ui-recruit-source-v2.png' },
  @{ Id = 'elder'; Label = 'ELDER'; Source = 'ui-elder-source.png' },
  @{ Id = 'expand'; Label = 'EXPAND'; Source = 'ui-expand-source.png' },
  @{ Id = 'research'; Label = 'RESEARCH'; Source = 'ui-research-source.png' },
  @{ Id = 'pause'; Label = 'PAUSE'; Source = 'ui-pause-source.png' },
  @{ Id = 'speed-1x'; Label = '1X'; Source = 'ui-speed-1x-source.png' },
  @{ Id = 'speed-2x'; Label = '2X'; Source = 'ui-speed-2x-source.png' }
)

foreach ($icon in $icons) {
  Export-UiIcon `
    -SourcePath (Join-Path $SourceDir $icon.Source) `
    -OutputPath (Join-Path $OutputDir ('ui-' + $icon.Id + '.png'))
}

$cellWidth = 160
$cellHeight = 150
$sheet = [System.Drawing.Bitmap]::new(
  $cellWidth * 4,
  $cellHeight * 2,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
)
$sheetGraphics = [System.Drawing.Graphics]::FromImage($sheet)
$sheetGraphics.Clear([System.Drawing.Color]::FromArgb(255, 255, 239, 193))
$sheetGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
$sheetGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
$font = [System.Drawing.Font]::new('Arial', 13, [System.Drawing.FontStyle]::Bold)
$textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(90, 51, 29))
$borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(240, 139, 62), 2)

for ($index = 0; $index -lt $icons.Count; $index++) {
  $column = $index % 4
  $row = [int][Math]::Floor($index / 4)
  $x = $column * $cellWidth
  $y = $row * $cellHeight
  $sheetGraphics.DrawRectangle($borderPen, $x + 5, $y + 5, $cellWidth - 10, $cellHeight - 10)
  $iconPath = Join-Path $OutputDir ('ui-' + $icons[$index].Id + '.png')
  $iconBitmap = [System.Drawing.Bitmap]::new($iconPath)
  $sheetGraphics.DrawImage($iconBitmap, [System.Drawing.Rectangle]::new($x + 32, $y + 12, 96, 96))
  $iconBitmap.Dispose()
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $sheetGraphics.DrawString(
    $icons[$index].Label,
    $font,
    $textBrush,
    [System.Drawing.RectangleF]::new($x, $y + 112, $cellWidth, 28),
    $format
  )
  $format.Dispose()
}

$sheet.Save((Join-Path $OutputDir 'ui-icons-review.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$borderPen.Dispose()
$textBrush.Dispose()
$font.Dispose()
$sheetGraphics.Dispose()
$sheet.Dispose()

Write-Output "Processed UI icons in $OutputDir"
