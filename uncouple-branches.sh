#!/bin/bash

# Uncouple Branches Script
# This script migrates two branches from Culi.Flow- to Sol-LOTJ-
# and then deletes them from the original repository

set -e  # Exit on any error

echo "=========================================="
echo "  Branch Uncoupling Script"
echo "  From: Culi.Flow-"
echo "  To:   Sol-LOTJ-"
echo "=========================================="
echo ""

# Configuration
NEW_REPO_URL="https://github.com/CheFsoL7-coder/Sol-LOTJ-.git"
NEW_REMOTE_NAME="sol-lotj"

# Branches to migrate
BARBER_BRANCH="claude/jewelz-dabarber-mvp-9PHVC"
CAREER_BRANCH="claude/career-business-strategy-2POBw"

# New branch names in Sol-LOTJ-
BARBER_NEW_NAME="jewelz-dabarber"
CAREER_NEW_NAME="career-business-strategy"

echo "Step 1: Adding Sol-LOTJ- as a remote..."
if git remote get-url $NEW_REMOTE_NAME > /dev/null 2>&1; then
    echo "  Remote '$NEW_REMOTE_NAME' already exists, updating URL..."
    git remote set-url $NEW_REMOTE_NAME $NEW_REPO_URL
else
    git remote add $NEW_REMOTE_NAME $NEW_REPO_URL
fi
echo "  ✓ Remote added: $NEW_REPO_URL"
echo ""

echo "Step 2: Fetching branches from origin..."
git fetch origin
echo "  ✓ Branches fetched"
echo ""

echo "Step 3: Pushing Barber page branch to Sol-LOTJ-..."
git push $NEW_REMOTE_NAME origin/$BARBER_BRANCH:refs/heads/$BARBER_NEW_NAME
echo "  ✓ Pushed as '$BARBER_NEW_NAME'"
echo ""

echo "Step 4: Pushing Career development branch to Sol-LOTJ-..."
git push $NEW_REMOTE_NAME origin/$CAREER_BRANCH:refs/heads/$CAREER_NEW_NAME
echo "  ✓ Pushed as '$CAREER_NEW_NAME'"
echo ""

echo "Step 5: Deleting branches from Culi.Flow- (origin)..."
echo "  Deleting $BARBER_BRANCH..."
git push origin --delete $BARBER_BRANCH || echo "  (Branch may already be deleted or doesn't exist on remote)"
echo "  Deleting $CAREER_BRANCH..."
git push origin --delete $CAREER_BRANCH || echo "  (Branch may already be deleted or doesn't exist on remote)"
echo "  ✓ Remote branches deleted"
echo ""

echo "Step 6: Cleaning up local branches (if they exist)..."
git branch -D $BARBER_BRANCH 2>/dev/null || echo "  (Local branch $BARBER_BRANCH not found, skipping)"
git branch -D $CAREER_BRANCH 2>/dev/null || echo "  (Local branch $CAREER_BRANCH not found, skipping)"
echo "  ✓ Local cleanup complete"
echo ""

echo "Step 7: Removing temporary remote..."
git remote remove $NEW_REMOTE_NAME
echo "  ✓ Remote '$NEW_REMOTE_NAME' removed"
echo ""

echo "=========================================="
echo "  ✓ COMPLETE!"
echo "=========================================="
echo ""
echo "Branches have been migrated to Sol-LOTJ-:"
echo "  - $BARBER_NEW_NAME (Barber page)"
echo "  - $CAREER_NEW_NAME (Career development)"
echo ""
echo "These branches have been deleted from Culi.Flow-"
echo ""
echo "View your new repo: https://github.com/CheFsoL7-coder/Sol-LOTJ-"
echo ""
