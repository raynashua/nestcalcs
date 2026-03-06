

# VPS Hosting Cost Calculator for Botswana

## Overview
A modern, friendly VPS hosting cost calculator for a cloud hosting provider in Botswana, built as a multi-page React app with a cloud-dashboard aesthetic.

## Pages

### 1. Landing Page (`/`)
- Welcome message: "Build your perfect VPS and instantly see the monthly price"
- Two large cards/buttons: **Calculate VPS Cost** and **Admin Settings**
- Deep cloud blue background with warm red accents, clean typography

### 2. VPS Calculator (`/calculator`)
- **Compute section**: vCPU slider (1–128), RAM slider (1–256 GB)
- **Storage section**: SSD slider (10–5000 GB), HDD slider (10–8000 GB)
- **Backup section**: Toggle switch + Backup storage slider (0–10000 GB)
- Each slider has a live numeric display and tooltip explaining the resource
- **Live pricing card** with animated cost breakdown: Compute, SSD, HDD, Backup (if enabled), and Grand Total in BWP
- Helper text: "Drag the sliders to build your perfect VPS!"
- Commented placeholders for future features (OS selection, IPs, bandwidth, discounts)

### 3. Admin Settings (`/admin`)
- Simple password gate (default: `admin123`, easily changeable in code)
- Editable fields for per-unit monthly pricing in BWP: vCPU, RAM, SSD, HDD, Backup storage
- Save Settings & Reset to Defaults buttons
- All values persisted in localStorage

## Design
- **Color palette**: Deep cloud blue primary, warm red accent, soft gray/white cards
- Rounded cards with soft shadows, smooth animations on price changes
- Fully responsive — sliders touch-friendly, cards stack vertically on mobile
- Subtle hover effects, emoji icons, friendly tone throughout

## Tech Approach
- React pages with react-router-dom
- Tailwind CSS for styling with custom CSS variables for the cloud theme
- Local state + localStorage for admin pricing config
- No backend needed

