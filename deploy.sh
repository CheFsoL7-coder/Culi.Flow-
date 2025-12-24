#!/bin/bash
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi
read -p "Enter GitHub repo URL (git@github.com:username/repo.git): " repo
git remote remove origin 2> /dev/null
git remote add origin "$repo"
git add .
git commit -m "Initial deploy: advanced dashboard"
git push -u origin main
