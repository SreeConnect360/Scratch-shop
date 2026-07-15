# Workspace Repository Push Rules

Every time changes are committed and need to be pushed to remote repositories, follow these rules:

1. **Main Repository**:
   Push the entire workspace project (both frontend and backend folders) to the primary repository:
   `https://github.com/SreeConnect360/Scratch-shop.git`

2. **Backend Dedicated Repository**:
   Push *only* the `reevibes-backend-render` folder to the dedicated backend repository:
   `https://github.com/SreeConnect360/Scratch-Render`

   **Subtree Execution Flow**:
   - Create a temporary subtree split branch:
     `git subtree split --prefix=reevibes-backend-render -b temp-backend-branch`
   - Force push the split branch to the backend remote:
     `git push https://github.com/SreeConnect360/Scratch-Render temp-backend-branch:main -f`
   - Clean up the local temporary branch:
     `git branch -D temp-backend-branch`
