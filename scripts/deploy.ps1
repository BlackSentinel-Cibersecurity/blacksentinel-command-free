#Requires -Version 5.1
<#
.SYNOPSIS
    BlackSentinel Command - Universal Deployment Script (Windows/PowerShell).
.DESCRIPTION
    Windows-native port of scripts/deploy.sh. Supports Docker, Kubernetes, AWS,
    Azure, GCP and On-Premise. Behaviour mirrors the bash version so the same
    deployment works on macOS, Linux (bash) and Windows (PowerShell).
.EXAMPLE
    pwsh ./scripts/deploy.ps1 docker -Tier starter -Env development
.EXAMPLE
    pwsh ./scripts/deploy.ps1 kubernetes -Tier enterprise -Env production
#>
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [ValidateSet('docker', 'kubernetes', 'aws', 'azure', 'gcp', 'on-premise', 'status', 'cleanup', 'help')]
    [string]$Command = 'help',

    [ValidateSet('starter', 'professional', 'enterprise', 'government')]
    [string]$Tier = 'starter',

    [ValidateSet('development', 'staging', 'production')]
    [string]$Env = 'development',

    [string]$Region = ''
)

$ErrorActionPreference = 'Stop'

# ----------------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------------
$AppName   = 'blacksentinel-command'
$Version   = '1.0.0'
$Namespace = 'blacksentinel'
$script:ComposeCmd = @('docker', 'compose')

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
function Write-Info($msg)  { Write-Host $msg -ForegroundColor Yellow }
function Write-Ok($msg)    { Write-Host $msg -ForegroundColor Green }
function Write-Err($msg)   { Write-Host $msg -ForegroundColor Red }

function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Invoke-Compose {
    param([Parameter(ValueFromRemainingArguments = $true)]$Args)
    & $script:ComposeCmd[0] ($script:ComposeCmd[1..($script:ComposeCmd.Count - 1)] + $Args)
}

function New-HexSecret([int]$Bytes = 32) {
    # Equivalent of `openssl rand -hex 32` without requiring openssl on Windows.
    $buffer = New-Object 'System.Byte[]' $Bytes
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($buffer)
    return -join ($buffer | ForEach-Object { $_.ToString('x2') })
}

function Show-Banner {
    Write-Host ''
    Write-Host '+==============================================================+' -ForegroundColor Blue
    Write-Host '|           BLACKSENTINEL COMMAND - DEPLOYMENT SCRIPT          |' -ForegroundColor Blue
    Write-Host '|           Unified Cybersecurity Command Center               |' -ForegroundColor Blue
    Write-Host '+==============================================================+' -ForegroundColor Blue
    Write-Host ''
}

function Test-Prerequisites {
    Write-Info 'Checking prerequisites...'
    if (-not (Test-Command 'docker')) {
        Write-Err 'Docker is not installed. Please install Docker first.'
        exit 1
    }
    if (Test-Command 'docker-compose') {
        $script:ComposeCmd = @('docker-compose')
    } else {
        Write-Info "Docker Compose not found as 'docker-compose'. Using 'docker compose' instead."
        $script:ComposeCmd = @('docker', 'compose')
    }
    Write-Ok 'Prerequisites check passed.'
}

# ----------------------------------------------------------------------------
# Docker
# ----------------------------------------------------------------------------
function Deploy-Docker {
    param([string]$DeployTier = 'starter', [string]$Mode = 'development')
    Write-Info "Deploying with Docker (Tier: $DeployTier, Mode: $Mode)..."

    $jwt = New-HexSecret 32
    $enc = New-HexSecret 32
    $envContent = @"
# BlackSentinel Command - Environment Configuration
NODE_ENV=$Mode
APP_VERSION=$Version
TIER=$DeployTier

# Database
DATABASE_URL=postgresql://blacksentinel:blacksentinel@postgres:5432/blacksentinel
REDIS_URL=redis://redis:6379
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=blacksentinel
ELASTICSEARCH_URL=http://elasticsearch:9200
KAFKA_BROKERS=kafka:9092

# Security
JWT_SECRET=$jwt
ENCRYPTION_KEY=$enc

# Features
FEATURE_AI_ENABLED=true
FEATURE_MARKETPLACE_ENABLED=true
FEATURE_MULTI_TENANT=true
"@
    # Write LF-terminated .env regardless of platform.
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) '.env'), ($envContent -replace "`r`n", "`n"))

    try { Invoke-Compose down -v 2>$null } catch { }
    Invoke-Compose up -d --build

    Write-Ok 'Docker deployment complete!'
    Write-Ok 'Application available at: http://localhost:3000'
}

# ----------------------------------------------------------------------------
# Kubernetes
# ----------------------------------------------------------------------------
function Deploy-Kubernetes {
    param([string]$DeployTier = 'starter', [string]$Environment = 'staging')
    Write-Info "Deploying to Kubernetes (Tier: $DeployTier, Env: $Environment)..."

    kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -
    kubectl apply -f k8s/base/ -n $Namespace
    if (Test-Path "k8s/overlays/$Environment") {
        kubectl apply -f "k8s/overlays/$Environment/" -n $Namespace
    }
    kubectl rollout status "deployment/$AppName" -n $Namespace

    Write-Ok 'Kubernetes deployment complete!'
    kubectl get pods -n $Namespace
}

# ----------------------------------------------------------------------------
# AWS / Azure / GCP
# ----------------------------------------------------------------------------
function Deploy-Aws {
    param([string]$DeployTier = 'starter', [string]$AwsRegion = 'us-east-1')
    Write-Info "Deploying to AWS (Tier: $DeployTier, Region: $AwsRegion)..."
    if (-not (Test-Command 'aws')) { Write-Err 'AWS CLI is not installed. Please install it first.'; exit 1 }

    & aws eks describe-cluster --name $AppName --region $AwsRegion *> $null
    if ($LASTEXITCODE -ne 0) {
        Write-Info 'EKS cluster not found. Creating...'
        eksctl create cluster --name $AppName --region $AwsRegion --nodes 3 --node-type t3.medium
    }
    aws eks update-kubeconfig --name $AppName --region $AwsRegion
    Deploy-Kubernetes -DeployTier $DeployTier -Environment 'production'
}

function Deploy-Azure {
    param([string]$DeployTier = 'starter', [string]$ResourceGroup = 'blacksentinel-rg', [string]$Location = 'eastus')
    Write-Info "Deploying to Azure (Tier: $DeployTier, RG: $ResourceGroup)..."
    if (-not (Test-Command 'az')) { Write-Err 'Azure CLI is not installed. Please install it first.'; exit 1 }

    az group create --name $ResourceGroup --location $Location
    az aks create --resource-group $ResourceGroup --name $AppName --node-count 3 --enable-addons monitoring --generate-ssh-keys
    az aks get-credentials --resource-group $ResourceGroup --name $AppName
    Deploy-Kubernetes -DeployTier $DeployTier -Environment 'production'
}

function Deploy-Gcp {
    param([string]$DeployTier = 'starter', [string]$Project = 'blacksentinel-project', [string]$GcpRegion = 'us-central1')
    Write-Info "Deploying to GCP (Tier: $DeployTier, Project: $Project)..."
    if (-not (Test-Command 'gcloud')) { Write-Err 'gcloud CLI is not installed. Please install it first.'; exit 1 }

    gcloud config set project $Project
    gcloud container clusters create $AppName --zone $GcpRegion --num-nodes 3 --enable-autoscaling --min-nodes 1 --max-nodes 5
    gcloud container clusters get-credentials $AppName --zone $GcpRegion
    Deploy-Kubernetes -DeployTier $DeployTier -Environment 'production'
}

# ----------------------------------------------------------------------------
# On-Premise / Status / Cleanup
# ----------------------------------------------------------------------------
function Deploy-OnPremise {
    param([string]$DeployTier = 'starter')
    Write-Info "Deploying On-Premise (Tier: $DeployTier)..."
    Test-Prerequisites
    Deploy-Docker -DeployTier $DeployTier -Mode 'production'
    Write-Ok 'On-Premise deployment complete!'
    Write-Ok 'Application available at: http://localhost:3000'
}

function Get-Status {
    Write-Info 'Checking deployment status...'
    $kubeHas = $false
    if (Test-Command 'kubectl') {
        kubectl get namespace $Namespace *> $null
        if ($LASTEXITCODE -eq 0) { $kubeHas = $true }
    }
    if ($kubeHas) {
        Write-Ok 'Kubernetes deployment found:'
        kubectl get pods -n $Namespace
        kubectl get services -n $Namespace
        return
    }
    try {
        Invoke-Compose ps *> $null
        Write-Ok 'Docker Compose deployment found:'
        Invoke-Compose ps
    } catch {
        Write-Err 'No deployment found.'
    }
}

function Remove-Deployment {
    Write-Info 'Cleaning up deployment...'
    if (Test-Command 'kubectl') {
        kubectl get namespace $Namespace *> $null
        if ($LASTEXITCODE -eq 0) { kubectl delete namespace $Namespace }
    }
    try { Invoke-Compose down -v } catch { }
    Write-Ok 'Cleanup complete.'
}

function Show-Help {
    @"
Usage: pwsh ./scripts/deploy.ps1 [COMMAND] [OPTIONS]

Commands:
  docker        Deploy with Docker Compose
  kubernetes    Deploy to Kubernetes
  aws           Deploy to AWS EKS
  azure         Deploy to Azure AKS
  gcp           Deploy to GCP GKE
  on-premise    Deploy on-premise
  status        Check deployment status
  cleanup       Remove deployment
  help          Show this help message

Options:
  -Tier         Tier: starter, professional, enterprise, government (default: starter)
  -Env          Environment: development, staging, production (default: development)
  -Region       Cloud region (AWS)

Examples:
  pwsh ./scripts/deploy.ps1 docker -Tier starter -Env development
  pwsh ./scripts/deploy.ps1 kubernetes -Tier enterprise -Env production
  pwsh ./scripts/deploy.ps1 aws -Tier professional -Region us-west-2
"@ | Write-Host
}

# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
Show-Banner

switch ($Command) {
    'docker'     { Test-Prerequisites; Deploy-Docker -DeployTier $Tier -Mode $Env }
    'kubernetes' { Deploy-Kubernetes -DeployTier $Tier -Environment $Env }
    'aws'        { Deploy-Aws -DeployTier $Tier -AwsRegion ($(if ($Region) { $Region } else { 'us-east-1' })) }
    'azure'      { Deploy-Azure -DeployTier $Tier }
    'gcp'        { Deploy-Gcp -DeployTier $Tier }
    'on-premise' { Deploy-OnPremise -DeployTier $Tier }
    'status'     { Get-Status }
    'cleanup'    { Remove-Deployment }
    default      { Show-Help }
}
