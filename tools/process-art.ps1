param(
  [string]$AssetDir = (Join-Path $PSScriptRoot '..\public\assets\v02'),
  [string]$SourceDir = (Join-Path $PSScriptRoot '..\art-source\v02')
)

Add-Type -AssemblyName System.Drawing

function Export-SheetCell {
  param(
    [string]$SourcePath,
    [int]$Columns,
    [int]$Rows,
    [int]$Column,
    [int]$Row,
    [string]$OutputPath,
    [int]$TargetWidth,
    [int]$TargetHeight,
    [int]$WorkingSize = 192,
    [int]$BottomPadding = 4
  )

  $source = [System.Drawing.Bitmap]::new($SourcePath)
  $cellWidth = [int]($source.Width / $Columns)
  $cellHeight = [int]($source.Height / $Rows)
  $working = [System.Drawing.Bitmap]::new($WorkingSize, $WorkingSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($working)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $workingScale = [Math]::Min($WorkingSize / $cellWidth, $WorkingSize / $cellHeight)
  $workingWidth = [Math]::Max(1, [int][Math]::Floor($cellWidth * $workingScale))
  $workingHeight = [Math]::Max(1, [int][Math]::Floor($cellHeight * $workingScale))
  $workingX = [int](($WorkingSize - $workingWidth) / 2)
  $workingY = [int](($WorkingSize - $workingHeight) / 2)
  $dest = [System.Drawing.Rectangle]::new($workingX, $workingY, $workingWidth, $workingHeight)
  $src = [System.Drawing.Rectangle]::new($Column * $cellWidth, $Row * $cellHeight, $cellWidth, $cellHeight)
  $graphics.DrawImage($source, $dest, $src, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $source.Dispose()

  $minX = $WorkingSize
  $minY = $WorkingSize
  $maxX = -1
  $maxY = -1
  for ($y = 0; $y -lt $WorkingSize; $y++) {
    for ($x = 0; $x -lt $WorkingSize; $x++) {
      $pixel = $working.GetPixel($x, $y)
      if ($pixel.A -eq 0) { continue }
      $isKey = $pixel.R -gt 180 -and $pixel.B -gt 180 -and $pixel.G -lt 165 `
        -and ($pixel.R - $pixel.G) -gt 55 -and ($pixel.B - $pixel.G) -gt 55
      if ($isKey) {
        $working.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
      } else {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }

  if ($maxX -lt $minX -or $maxY -lt $minY) {
    $working.Dispose()
    throw "No sprite pixels found in $OutputPath"
  }

  $sourceWidth = $maxX - $minX + 1
  $sourceHeight = $maxY - $minY + 1
  $padding = 4
  $maxWidth = $TargetWidth - $padding * 2
  $maxHeight = $TargetHeight - $padding * 2
  $scale = [Math]::Min($maxWidth / $sourceWidth, $maxHeight / $sourceHeight)
  $drawWidth = [Math]::Max(1, [int][Math]::Floor($sourceWidth * $scale))
  $drawHeight = [Math]::Max(1, [int][Math]::Floor($sourceHeight * $scale))
  $drawX = [int](($TargetWidth - $drawWidth) / 2)
  $drawY = $TargetHeight - $BottomPadding - $drawHeight

  $output = [System.Drawing.Bitmap]::new($TargetWidth, $TargetHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
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

function Export-MenuBackground {
  param(
    [string]$SourcePath,
    [string]$OutputPath
  )

  $source = [System.Drawing.Bitmap]::new($SourcePath)
  $output = [System.Drawing.Bitmap]::new(1280, 720, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $graphics = [System.Drawing.Graphics]::FromImage($output)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
  $graphics.DrawImage($source, [System.Drawing.Rectangle]::new(0, 0, 1280, 720))
  $graphics.Dispose()
  $source.Dispose()

  $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
  $quality = [System.Drawing.Imaging.EncoderParameter]::new(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]88
  )
  $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $parameters.Param[0] = $quality
  $output.Save($OutputPath, $jpegCodec, $parameters)
  $parameters.Dispose()
  $quality.Dispose()
  $output.Dispose()
}

$singleBuildingSource = Join-Path $SourceDir 'building-lingtian-source.png'
$characterSource = Join-Path $SourceDir 'characters-sheet-source.png'
$visitorBackSource = Join-Path $SourceDir 'characters-visitor-back-sheet-source.png'
$menuSource = Join-Path $SourceDir 'menu-mountains-source.png'

if (Test-Path $singleBuildingSource) {
  foreach ($buildingId in @('lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang', 'gate')) {
    Export-SheetCell -SourcePath (Join-Path $SourceDir ('building-' + $buildingId + '-source.png')) `
      -Columns 1 -Rows 1 -Column 0 -Row 0 `
      -OutputPath (Join-Path $AssetDir ('building-' + $buildingId + '.png')) `
      -TargetWidth 128 -TargetHeight 112 -BottomPadding 0
  }

  $characters = @(
    @{ Name = 'character-disciple-a.png'; X = 0; Y = 0 },
    @{ Name = 'character-disciple-b.png'; X = 1; Y = 0 },
    @{ Name = 'character-disciple-c.png'; X = 2; Y = 0 },
    @{ Name = 'character-disciple-d.png'; X = 3; Y = 0 },
    @{ Name = 'character-visitor-a.png'; X = 0; Y = 1 },
    @{ Name = 'character-visitor-b.png'; X = 1; Y = 1 },
    @{ Name = 'character-visitor-c.png'; X = 2; Y = 1 },
    @{ Name = 'character-visitor-d.png'; X = 3; Y = 1 }
  )
  foreach ($character in $characters) {
    Export-SheetCell -SourcePath $characterSource -Columns 4 -Rows 2 `
      -Column $character.X -Row $character.Y `
      -OutputPath (Join-Path $AssetDir $character.Name) `
      -TargetWidth 48 -TargetHeight 64 -WorkingSize 128
  }

  if (Test-Path $visitorBackSource) {
    foreach ($index in 0..3) {
      $variant = @('a', 'b', 'c', 'd')[$index]
      Export-SheetCell -SourcePath $visitorBackSource -Columns 4 -Rows 1 `
        -Column $index -Row 0 `
        -OutputPath (Join-Path $AssetDir ('character-visitor-' + $variant + '-back.png')) `
        -TargetWidth 48 -TargetHeight 64 -WorkingSize 128
    }
  }
} else {
  $buildingSource = Join-Path $SourceDir 'buildings-sheet-source.png'
  $buildings = @(
    @{ Name = 'building-lingtian.png'; X = 0; Y = 0 },
    @{ Name = 'building-danfang.png'; X = 1; Y = 0 },
    @{ Name = 'building-danpu.png'; X = 0; Y = 1 },
    @{ Name = 'building-liangong.png'; X = 1; Y = 1 },
    @{ Name = 'building-xiangfang.png'; X = 0; Y = 2 },
    @{ Name = 'building-gate.png'; X = 1; Y = 2 }
  )
  foreach ($building in $buildings) {
    Export-SheetCell -SourcePath $buildingSource -Columns 2 -Rows 3 `
      -Column $building.X -Row $building.Y `
      -OutputPath (Join-Path $AssetDir $building.Name) `
      -TargetWidth 128 -TargetHeight 112 -BottomPadding 0
  }

  $characters = @(
    @{ Name = 'character-disciple.png'; X = 0; Y = 0 },
    @{ Name = 'character-visitor-a.png'; X = 1; Y = 0 },
    @{ Name = 'character-visitor-b.png'; X = 0; Y = 1 },
    @{ Name = 'character-visitor-c.png'; X = 1; Y = 1 }
  )
  foreach ($character in $characters) {
    Export-SheetCell -SourcePath $characterSource -Columns 2 -Rows 2 `
      -Column $character.X -Row $character.Y `
      -OutputPath (Join-Path $AssetDir $character.Name) `
      -TargetWidth 48 -TargetHeight 64 -WorkingSize 128
  }
}

if (Test-Path $menuSource) {
  Export-MenuBackground -SourcePath $menuSource -OutputPath (Join-Path $AssetDir 'menu-mountains.jpg')
}

Write-Output "Processed art assets in $AssetDir"
