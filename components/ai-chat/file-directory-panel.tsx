"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  FileCode2,
  FileJson,
  FileType2,
  FileText,
  Folder,
  FolderOpen,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneratedFile } from "./types";

interface FileDirectoryPanelProps {
  files: GeneratedFile[];
  selectedFile: string | null;
  onFileSelect: (file: GeneratedFile) => void;
}

// ── File icon by extension ──────────────────────────────────
function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["tsx", "ts", "jsx", "js"].includes(ext)) return FileCode2;
  if (["css", "scss", "sass"].includes(ext)) return FileType2;
  if (["json"].includes(ext)) return FileJson;
  return FileText;
}

function getFileIconColor(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["tsx", "jsx"].includes(ext)) return "text-blue-500";
  if (["ts", "js"].includes(ext)) return "text-yellow-500";
  if (["css", "scss", "sass"].includes(ext)) return "text-pink-500";
  if (["json"].includes(ext)) return "text-orange-400";
  return "text-neutral-400";
}

// ── Tree Data Structure ─────────────────────────────────────
interface TreeNode {
  name: string;
  fullPath: string;
  isDir: boolean;
  children: TreeNode[];
  file?: GeneratedFile;
}

function buildTree(files: GeneratedFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLast = i === parts.length - 1;
      const fullPath = parts.slice(0, i + 1).join("/");

      let node = current.find((n) => n.name === name);
      if (!node) {
        node = {
          name,
          fullPath,
          isDir: !isLast,
          children: [],
          file: isLast ? file : undefined,
        };
        current.push(node);
      }
      current = node.children;
    }
  }

  // Sort: directories first, then files, alphabetically
  function sortNodes(nodes: TreeNode[]): TreeNode[] {
    return [...nodes]
      .sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((n) => ({ ...n, children: sortNodes(n.children) }));
  }

  return sortNodes(root);
}

// ── Tree Node Component ─────────────────────────────────────
function TreeNodeRow({
  node,
  depth,
  selectedFile,
  onFileSelect,
  openDirs,
  onToggleDir,
}: {
  node: TreeNode;
  depth: number;
  selectedFile: string | null;
  onFileSelect: (file: GeneratedFile) => void;
  openDirs: Set<string>;
  onToggleDir: (path: string) => void;
}) {
  const isOpen = openDirs.has(node.fullPath);
  const isSelected = !node.isDir && selectedFile === node.fullPath;
  const FileIcon = node.isDir ? (isOpen ? FolderOpen : Folder) : getFileIcon(node.name);
  const fileIconColor = node.isDir ? "text-yellow-400" : getFileIconColor(node.name);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => {
          if (node.isDir) {
            onToggleDir(node.fullPath);
          } else if (node.file) {
            onFileSelect(node.file);
          }
        }}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-left transition-colors group",
          isSelected
            ? "bg-blue-50 text-blue-700"
            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        )}
        style={{ paddingLeft: `${8 + depth * 14}px` }}
      >
        {/* Chevron for folders */}
        {node.isDir ? (
          <span className="shrink-0 size-3.5 text-neutral-400">
            {isOpen ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
          </span>
        ) : (
          <span className="shrink-0 size-3.5" />
        )}

        <FileIcon className={cn("shrink-0 size-3.5", fileIconColor)} />
        <span className="text-[11px] font-medium truncate">{node.name}</span>
      </motion.button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {node.isDir && isOpen && (
          <motion.div
            key={node.fullPath + "-children"}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeNodeRow
                key={child.fullPath}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                openDirs={openDirs}
                onToggleDir={onToggleDir}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Panel ──────────────────────────────────────────────
export function FileDirectoryPanel({
  files,
  selectedFile,
  onFileSelect,
}: FileDirectoryPanelProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  // Open all root directories by default
  const initialOpen = useMemo(() => {
    const set = new Set<string>();
    tree.forEach((n) => {
      if (n.isDir) set.add(n.fullPath);
    });
    return set;
  }, [tree]);

  const [openDirs, setOpenDirs] = useState<Set<string>>(initialOpen);

  const handleToggleDir = (path: string) => {
    setOpenDirs((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 border-r border-neutral-200">
      {/* Header */}
      <div className="flex items-center gap-2 h-12 px-3 border-b border-neutral-200 bg-white shrink-0">
        <Files className="size-4 text-neutral-400" />
        <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">Files</span>
        <span className="ml-auto flex items-center px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold">
          {files.length}
        </span>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2 px-1">
        {tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-300 gap-2 py-8">
            <Files className="size-8" />
            <p className="text-[11px]">Belum ada file</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.03 } },
            }}
          >
            {tree.map((node) => (
              <TreeNodeRow
                key={node.fullPath}
                node={node}
                depth={0}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                openDirs={openDirs}
                onToggleDir={handleToggleDir}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
