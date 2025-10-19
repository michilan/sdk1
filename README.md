# 陽光年會儀表板

這是一個使用 React + Vite 打造的活動儀表板，並透過 Firebase Firestore 儲存前台與後台共用的資料。

## 專案結構

- `frontend/`：React 前端專案，包含前台頁面與後台管理頁面。
- `frontend/src/pages/HomePage.jsx`：前台儀表板視覺化呈現。
- `frontend/src/pages/AdminPage.jsx`：後台編輯介面，可即時更新 Firestore 內容。
- `frontend/src/hooks/useDashboardData.js`：封裝與 Firestore 的資料讀寫邏輯。

## 快速開始

1. 參考 `.env.example` 建立 `frontend/.env`，並填入 Firebase 專案設定：

   ```bash
   cp frontend/.env.example frontend/.env
   # 編輯 frontend/.env 加入 Firebase 專案資訊
   ```

2. 安裝依賴並啟動開發伺服器：

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. 在瀏覽器開啟 `http://localhost:5173/` 即可看到前台頁面，後台管理頁面位於 `http://localhost:5173/admin`。

## Firebase 結構說明

- 集合：`dashboard`
- 文件：`content`
- 欄位結構可參考 `useDashboardData.js` 預設內容；後台頁面儲存時會自動建立或更新該文件。

## 發佈

使用 `npm run build` 產生靜態檔案，位於 `frontend/dist`，可部署至任意靜態主機或 Firebase Hosting。
