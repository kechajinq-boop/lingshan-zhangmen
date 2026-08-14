param(
  [string]$ManifestPath = "deliverables\v10-continuous-flat-production\buildable-qa\buildable-mask-manifest-v1.json"
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$manifestFullPath = (Resolve-Path (Join-Path $projectRoot $ManifestPath)).Path
$manifest = Get-Content -Raw -Encoding UTF8 $manifestFullPath | ConvertFrom-Json
$outputDir = Split-Path -Parent $manifestFullPath

function New-PointArray($points) {
  $result = New-Object 'System.Drawing.PointF[]' $points.Count
  for ($i = 0; $i -lt $points.Count; $i++) {
    $result[$i] = New-Object System.Drawing.PointF -ArgumentList ([single]$points[$i][0]), ([single]$points[$i][1])
  }
  return $result
}

function New-Diamond([single]$x, [single]$y, [single]$width, [single]$height) {
  [System.Drawing.PointF[]]@(
    (New-Object System.Drawing.PointF -ArgumentList ([single]$x), ([single]($y - $height / 2))),
    (New-Object System.Drawing.PointF -ArgumentList ([single]($x + $width / 2)), ([single]$y)),
    (New-Object System.Drawing.PointF -ArgumentList ([single]$x), ([single]($y + $height / 2))),
    (New-Object System.Drawing.PointF -ArgumentList ([single]($x - $width / 2)), ([single]$y))
  )
}

$greenFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 40, 215, 100))
$greenPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 8, 123, 51), 6)
$redFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(125, 255, 66, 88))
$redPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 143, 0, 20), 3)
$roadPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(150, 255, 66, 88), 30)
$roadPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$roadPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$roadPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$goldFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(190, 255, 227, 122))
$goldPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 122, 76, 0), 3)
$blueFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 99, 216, 255))
$bluePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 0, 110, 147), 3)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$darkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 60, 42, 24))
$smallDarkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 21, 33, 43))
$panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 255, 249, 232))
$panelPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 95, 65, 34), 4)
$titleFont = New-Object System.Drawing.Font('Microsoft YaHei', 20, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font('Microsoft YaHei', 15, [System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font('Microsoft YaHei', 11, [System.Drawing.FontStyle]::Regular)
$numberFont = New-Object System.Drawing.Font('Microsoft YaHei', 10, [System.Drawing.FontStyle]::Bold)
$labelFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
$centerFormat = New-Object System.Drawing.StringFormat
$centerFormat.Alignment = [System.Drawing.StringAlignment]::Center
$centerFormat.LineAlignment = [System.Drawing.StringAlignment]::Center

try {
  foreach ($stage in $manifest.stages) {
    $basePath = (Resolve-Path (Join-Path $projectRoot $stage.base)).Path
    $source = [System.Drawing.Image]::FromFile($basePath)
    $bitmap = New-Object System.Drawing.Bitmap([int]$manifest.canvas.width, [int]$manifest.canvas.height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.DrawImage($source, 0, 0, $bitmap.Width, $bitmap.Height)

      $buildablePoints = New-PointArray $stage.cumulativeBuildablePolygon
      $graphics.FillPolygon($greenFill, $buildablePoints)
      $graphics.DrawPolygon($greenPen, $buildablePoints)

      $waterPoints = New-PointArray $manifest.exclusions.waterPolygon
      $graphics.FillPolygon($redFill, $waterPoints)
      $graphics.DrawPolygon($redPen, $waterPoints)

      foreach ($road in $manifest.exclusions.roadCorridors) {
        $roadPen.Width = [single]$road.width
        $roadPoints = New-PointArray $road.points
        $graphics.DrawLines($roadPen, $roadPoints)
      }

      foreach ($zone in $manifest.exclusions.reservedLandmarks) {
        $rect = New-Object System.Drawing.RectangleF -ArgumentList ([single]$zone.x), ([single]$zone.y), ([single]$zone.width), ([single]$zone.height)
        $graphics.FillRectangle($redFill, $rect)
        $graphics.DrawRectangle($redPen, $rect.X, $rect.Y, $rect.Width, $rect.Height)
        $graphics.DrawString([string]$zone.label, $labelFont, $whiteBrush, $rect, $centerFormat)
      }

      $slotIndex = 0
      foreach ($slot in $stage.sampleFootprints) {
        $slotIndex += 1
        $diamond = New-Diamond ([single]$slot.x) ([single]$slot.y) ([single]$manifest.grid.buildingFootprintPixels.width) ([single]$manifest.grid.buildingFootprintPixels.height)
        if ([int]$slot.unlockStage -eq [int]$stage.id) {
          $graphics.FillPolygon($blueFill, $diamond)
          $graphics.DrawPolygon($bluePen, $diamond)
        } else {
          $graphics.FillPolygon($goldFill, $diamond)
          $graphics.DrawPolygon($goldPen, $diamond)
        }
        $numberRect = New-Object System.Drawing.RectangleF -ArgumentList ([single]($slot.x - 24)), ([single]($slot.y - 13)), ([single]48), ([single]26)
        $graphics.DrawString([string]$slotIndex, $numberFont, $smallDarkBrush, $numberRect, $centerFormat)
      }

      $panelRect = New-Object System.Drawing.RectangleF -ArgumentList ([single]24), ([single]22), ([single]535), ([single]138)
      $graphics.FillRectangle($panelBrush, $panelRect)
      $graphics.DrawRectangle($panelPen, $panelRect.X, $panelRect.Y, $panelRect.Width, $panelRect.Height)
      $previousCapacity = if ([int]$stage.id -eq 1) { 0 } else { [int]$manifest.stages[[int]$stage.id - 2].capacityTarget }
      $newCapacity = [int]$stage.capacityTarget - $previousCapacity
      $titleText = "V0.10 {0}{1}" -f $stage.name, $manifest.labels.titleSuffix
      $capacityText = "{0}{1} {2}{3} {4} {5}" -f $manifest.labels.capacityPrefix, $stage.capacityTarget, $manifest.labels.buildingUnit, $manifest.labels.stageNewPrefix, $newCapacity, $manifest.labels.stageNewSuffix
      $graphics.DrawString($titleText, $titleFont, $darkBrush, 44, 34)
      $graphics.DrawString($capacityText, $bodyFont, $darkBrush, 44, 73)
      $graphics.FillRectangle($greenFill, 44, 111, 24, 18)
      $graphics.DrawString([string]$manifest.labels.buildable, $smallFont, $darkBrush, 76, 109)
      $graphics.FillRectangle($redFill, 202, 111, 24, 18)
      $graphics.DrawString([string]$manifest.labels.forbidden, $smallFont, $darkBrush, 234, 109)
      $graphics.FillPolygon($goldFill, (New-Diamond 355 120 24 14))
      $graphics.DrawString([string]$manifest.labels.retained, $smallFont, $darkBrush, 373, 109)
      $graphics.FillPolygon($blueFill, (New-Diamond 475 120 24 14))
      $graphics.DrawString([string]$manifest.labels.newlyUnlocked, $smallFont, $darkBrush, 493, 109)
      $graphics.DrawString([string]$manifest.labels.note, $smallFont, $darkBrush, 44, 137)

      $outputPath = Join-Path $outputDir ("stage{0}-buildable-mask-qa.png" -f $stage.id)
      $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
      Write-Output ("Generated {0}" -f $outputPath)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
      $source.Dispose()
    }
  }
} finally {
  @($greenFill,$greenPen,$redFill,$redPen,$roadPen,$goldFill,$goldPen,$blueFill,$bluePen,$whiteBrush,$darkBrush,$smallDarkBrush,$panelBrush,$panelPen,$titleFont,$bodyFont,$smallFont,$numberFont,$labelFont,$centerFormat) | ForEach-Object { $_.Dispose() }
}
