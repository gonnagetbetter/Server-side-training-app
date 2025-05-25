# extract-ts.ps1

# Папка с исходниками и итоговый файл
$srcFolder  = "src"
$outputFile = "all_code.txt"

# Абсолютный путь к src
$rootPath = (Resolve-Path $srcFolder).Path

# Если файл уже существует — удалить
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Собираем все .ts файлы, кроме тех, что в папках migrations
Get-ChildItem -Path $srcFolder -Recurse -Filter *.ts |
    Where-Object { $_.FullName -notmatch "\\migrations\\" } |
    ForEach-Object {
        # Вычисляем относительный путь от папки src
        $relativePath = $_.FullName.Substring($rootPath.Length + 1)

        # Заголовок с относительным путём
        Add-Content $outputFile ("`r`n===== File: src\$relativePath =====`r`n")

        # Содержимое файла
        Get-Content $_.FullName | Add-Content $outputFile
    }

Write-Host "Done! Code saved to $outputFile"
