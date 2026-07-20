import os

# We point this directly to your Next.js src folder
base_dir = "./frontend/src"

# This is the exact list of files from the Project Bible
files_to_create = [
    # 1. App Router Pages
    "app/(dashboard)/layout.tsx",
    "app/(dashboard)/page.tsx",
    "app/subject/[id]/page.tsx",
    "app/upload/page.tsx",
    "app/quiz/[subjectId]/page.tsx",
    
    # 2. Chat Components
    "components/chat/ChatWindow.tsx",
    "components/chat/ChatInput.tsx",
    "components/chat/MessageBubble.tsx",
    "components/chat/AnswerCard.tsx",
    "components/chat/CodeBlock.tsx",
    "components/chat/DiagramBlock.tsx",
    "components/chat/SourceBadge.tsx",
    "components/chat/LoadingDots.tsx",
    
    # 3. Upload Components
    "components/upload/DropZone.tsx",
    "components/upload/FileList.tsx",
    "components/upload/SubjectSelector.tsx",
    "components/upload/ProgressBar.tsx",
    
    # 4. Layout Components
    "components/layout/Sidebar.tsx",
    "components/layout/SubjectCard.tsx",
    "components/layout/TopBar.tsx",
    
    # 5. Lib / Logic
    "lib/api.ts",
    "lib/types.ts",
    "lib/utils.ts",
    "lib/markdown.ts",
    
    # 6. Hooks
    "hooks/useChat.ts",
    "hooks/useSubjects.ts",
    "hooks/useUpload.ts",
    "hooks/usePyodide.ts",
    
    # 7. State Management
    "store/chatStore.ts",
    "store/subjectStore.ts",
    
    # 8. Styles
    "styles/glass.css"
]

print("Building frontend structure...")

for file_path in files_to_create:
    # Build the full path
    full_path = os.path.join(base_dir, file_path)
    
    # Create the folders if they don't exist
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    # Create the empty file (with a tiny comment so it's not entirely blank)
    if not os.path.exists(full_path):
        with open(full_path, 'w') as f:
            f.write("// Component stub ready for Claude\n")
            
print("✅ All folders and empty files created successfully!")