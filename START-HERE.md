# 🚀 Getting Started with n8n Re-developed

## Welcome!

You now have a fully re-developed n8n platform with:
- ✅ **Separate repositories** (backend + frontend)
- ✅ **React frontend** instead of Vue
- ✅ **Modern architecture** with TypeScript throughout

## 📁 Project Structure

```
/home/user/
├── n8n-backend/          # Node.js + Express + TypeORM
├── n8n-frontend/         # React + Vite + React Flow
└── n8n-redeveloped-README.md  # Main documentation
```

## 🏃 Quick Start Guide

### Step 1: Install Dependencies

Open **two terminal windows**.

**Terminal 1 - Backend:**
```bash
cd /home/user/n8n-backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd /home/user/n8n-frontend
npm install
```

### Step 2: Start Development Servers

**Terminal 1 - Backend:**
```bash
npm run dev
```
✅ Backend will start on **http://localhost:3001**

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend will start on **http://localhost:3000**

### Step 3: Open the Application

Open your browser to: **http://localhost:3000**

## 🎯 What You Can Do

### 1. Create a Workflow
- Click "New" in the left sidebar
- Enter a workflow name
- Click "Create"

### 2. Add Nodes to Canvas
- Drag nodes from the right "Nodes" palette
- Drop them onto the canvas

### 3. Connect Nodes
- Drag from a node's right handle (output)
- Connect to another node's left handle (input)
- Create your workflow logic!

### 4. Save Workflow
- Click "Save" button in top-right
- Workflow is persisted to SQLite database

### 5. Execute Workflow
- Click "Execute" button
- Watch your workflow run!
- Check backend terminal for execution logs

## 📦 Available Nodes

1. **Start** 🟢 - Entry point (no inputs)
2. **HTTP Request** 🔵 - Make API calls
3. **Set** 🟣 - Transform data
4. **Code** 🟠 - Run JavaScript
5. **IF** 🟢 - Conditional logic (2 outputs: true/false)
6. **Switch** 🟡 - Multi-way routing (4 outputs)
7. **Merge** 🔷 - Combine multiple inputs

## 🛠️ Development Commands

### Backend
```bash
cd n8n-backend
npm run dev        # Start dev server
npm run build      # Build for production
npm start          # Run production build
npm run typecheck  # Check TypeScript types
```

### Frontend
```bash
cd n8n-frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 📚 Documentation

- **Main README**: `/home/user/n8n-redeveloped-README.md`
- **Backend README**: `/home/user/n8n-backend/README.md`
- **Frontend README**: `/home/user/n8n-frontend/README.md`

## 🐛 Troubleshooting

### Backend won't start
```bash
cd n8n-backend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend won't start
```bash
cd n8n-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
- Backend port 3001: Change in `/home/user/n8n-backend/.env`
- Frontend port 3000: Change in `/home/user/n8n-frontend/vite.config.ts`

### API connection issues
- Ensure backend is running on port 3001
- Check `/home/user/n8n-frontend/.env` has correct API URL

## 🎓 Example Workflow

Try creating this simple workflow:

```
[Start] → [Set] → [HTTP Request] → [Code]
```

1. **Start Node**: Entry point (no config needed)
2. **Set Node**:
   - Values: `{"url": "https://api.github.com/users/octocat"}`
3. **HTTP Request Node**:
   - Method: GET
   - URL: Use data from Set node
4. **Code Node**:
   - Process the API response

## 🚀 Next Steps

1. **Explore the code**:
   - Backend: Check out `/home/user/n8n-backend/src/nodes/` for node implementations
   - Frontend: Look at `/home/user/n8n-frontend/src/components/` for UI components

2. **Add your own node**:
   - Create a new file in `n8n-backend/src/nodes/MyNode.ts`
   - Register it in `n8n-backend/src/index.ts`
   - Restart backend

3. **Customize the UI**:
   - Edit `/home/user/n8n-frontend/src/components/CustomNode.tsx`
   - Modify colors, styles, layout

4. **Read the architecture**:
   - See main README for detailed architecture explanation
   - Understand the workflow execution engine

## 💡 Key Features

✅ **Separate Repos**: Frontend and backend are completely independent
✅ **React**: Modern React 18 with hooks and TypeScript
✅ **Visual Editor**: Drag-and-drop workflow canvas
✅ **Type-Safe**: Full TypeScript coverage
✅ **Real Execution**: Workflows actually run and produce results
✅ **Extensible**: Easy to add new nodes

## 📞 Need Help?

- Check the main README: `/home/user/n8n-redeveloped-README.md`
- Review the code - it's well-commented
- Compare with original n8n: https://github.com/n8n-io/n8n

---

**Ready to build workflows? Start both servers and visit http://localhost:3000** 🎉
