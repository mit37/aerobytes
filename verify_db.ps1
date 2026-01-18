$ErrorActionPreference = "Stop"

function Test-Api($Url, $Method, $Body) {
    echo "Testing $Method $Url"
    try {
        if ($Body) {
            $Response = Invoke-RestMethod -Uri $Url -Method $Method -Body ($Body | ConvertTo-Json -Depth 10) -ContentType "application/json"
        }
        else {
            $Response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        return $Response
    }
    catch {
        echo "Error: $_"
        echo "StackTrace: $($_.Exception.StackTrace)"
        if ($_.Exception.Response) {
            $Stream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($Stream)
            $Body = $Reader.ReadToEnd()
            echo "Response Body: $Body"
        }
        return $null
    }
}

# 1. Create a Order with new User
$OrderData = @{
    customer = @{
        name    = "Test User"
        email   = "test@example.com"
        phone   = "123-456-7890"
        address = "123 Test St"
    }
    items    = @(
        @{ id = "40-pizza"; name = "Test Pizza"; price = 10; quantity = 1 }
    )
    total    = 10
}

$OrderResponse = Test-Api "http://localhost:3001/api/orders" "POST" $OrderData
if ($OrderResponse.success -eq $true -and $OrderResponse.user.email -eq "test@example.com") {
    echo "PASS: Order created and user returned"
}
else {
    echo "FAIL: Order creation failed"
    exit 1
}

Start-Sleep -Seconds 2

# 2. Verify User Order History
$HistoryResponse = Test-Api "http://localhost:3001/api/users/test@example.com/orders" "GET" $null
if ($HistoryResponse.user.email -eq "test@example.com" -and $HistoryResponse.orders.Count -ge 1) {
    echo "PASS: Order history retrieval successful"
}
else {
    echo "FAIL: Order history retrieval failed"
    exit 1
}

echo "ALL TESTS PASSED"
