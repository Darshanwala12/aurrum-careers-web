param(
  [string]$Source = (Join-Path $PSScriptRoot '..\wordpress-theme\aurrum-career-companion'),
  [string]$HostName = 'ftp.aurrumcareers.com',
  [string]$Username = 'u737824243.aurrumcareers',
  [string]$RemoteRoot = '/wp-content/themes/aurrum-career-companion'
)

$securePassword = Read-Host 'FTP password' -AsSecureString
$credential = [pscredential]::new($Username, $securePassword)
[string]$Source = (Resolve-Path -LiteralPath $Source).Path.TrimEnd('\', '/')
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }

function Invoke-Ftp([string]$relative, [string]$method, [byte[]]$content = $null) {
  $uri = [uri]::new("ftp://$HostName$RemoteRoot/$relative")
  $request = [System.Net.FtpWebRequest]::Create($uri)
  $request.Method = $method
  $request.Credentials = $credential
  $request.EnableSsl = $true
  $request.UseBinary = $true
  $request.KeepAlive = $false
  if ($null -ne $content) {
    $request.ContentLength = $content.Length
    $stream = $request.GetRequestStream()
    try { $stream.Write($content, 0, $content.Length) } finally { $stream.Dispose() }
  }
  try { $response = $request.GetResponse(); $response.Dispose() } catch [System.Net.WebException] {
    if ($method -ne [System.Net.WebRequestMethods+Ftp]::MakeDirectory) { throw }
  }
}

$directories = Get-ChildItem -LiteralPath $Source -Directory -Recurse | Sort-Object FullName
foreach ($directory in $directories) {
  $relative = $directory.FullName.Substring($Source.Length).TrimStart('\', '/').Replace('\', '/')
  Invoke-Ftp -relative $relative -method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory)
}

$files = Get-ChildItem -LiteralPath $Source -File -Recurse | Where-Object { $_.Name -ne 'README.md' }
foreach ($file in $files) {
  $relative = $file.FullName.Substring($Source.Length).TrimStart('\', '/').Replace('\', '/')
  Invoke-Ftp -relative $relative -method ([System.Net.WebRequestMethods+Ftp]::UploadFile) -content ([IO.File]::ReadAllBytes($file.FullName))
  Write-Host "Uploaded $relative"
}
