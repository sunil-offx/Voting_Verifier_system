Write-Host "Setting up Frontend (Vite/React)..."
npx -y create-vite@latest frontend --template react
Set-Location frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom axios ethers
Set-Location ..\backend
Write-Host "Setting up Backend (Express)..."
npm install
Set-Location ..\blockchain
Write-Host "Setting up Blockchain (Hardhat)..."
npm install
Set-Location ..
Write-Host "Dependencies setup complete! All folders are ready."
