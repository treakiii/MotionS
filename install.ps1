
# MotionS Installer 🚀
# Usage: irm https://raw.githubusercontent.com/username/MotionS/main/install.ps1 | iex

Write-Host "🚀 MotionS Installer" -ForegroundColor Cyan
Write-Host "---------------------" -ForegroundColor Gray

if (!(Test-Path "package.json")) {
    Write-Host "❌ No package.json found. Please run this in your project root." -ForegroundColor Red
    exit
}

$choice = Read-Host "Install for [1] React or [2] Vanilla JS?"

if ($choice -eq "1") {
    Write-Host "📦 Installing @motions/react..." -ForegroundColor Green
    npm install @motions/react
    
    $sample = @"
import { motion } from '@motions/react';

export const MotionBox = () => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotateX: -45 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ spring: 'bouncy' }}
    whileHover={{ scale: 1.1, rotateY: 15 }}
    style={{
      width: 100,
      height: 100,
      background: 'linear-gradient(135deg, #ff0055, #00ddeb)',
      borderRadius: 20
    }}
  />
);
"@
    $sample | Out-File -FilePath "MotionBox.tsx" -Encoding utf8
    Write-Host "✅ Created MotionBox.tsx sample!" -ForegroundColor Green
} else {
    Write-Host "📦 Installing @motions/dom..." -ForegroundColor Green
    npm install @motions/dom
    
    $sample = @"
import { animate } from '@motions/dom';

const el = document.querySelector('.box');
animate(el, 
  { x: 200, rotate: 180, blur: 5 }, 
  { spring: 'snappy' }
);
"@
    $sample | Out-File -FilePath "motion-demo.js" -Encoding utf8
    Write-Host "✅ Created motion-demo.js sample!" -ForegroundColor Green
}

Write-Host "`n✨ MotionS successfully installed! Stay fluid." -ForegroundColor Cyan
