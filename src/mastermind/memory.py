"""
KTV Mastermind — Persistent File-Based Memory System

Stores and retrieves strategic data in categorised files under /memories.
Supports: view, append, str_replace, list, create operations.
"""

import os
import json
from pathlib import Path
from datetime import datetime, timezone
from typing import Optional

from .config import MEMORY_DIR


def _ensure_dir(filepath: Path) -> None:
    filepath.parent.mkdir(parents=True, exist_ok=True)


def _resolve_path(file_path: str) -> Path:
    """Resolve a memory path, stripping leading /memories/ if present."""
    clean = file_path.lstrip("/")
    if clean.startswith("memories/"):
        clean = clean[len("memories/"):]
    return MEMORY_DIR / clean


def memory_view(file_path: str) -> str:
    """Read the full contents of a memory file."""
    path = _resolve_path(file_path)
    if not path.exists():
        return f"[MEMORY] File not found: {file_path}. Use 'create' to initialise it."
    return path.read_text(encoding="utf-8")


def memory_append(file_path: str, content: str) -> str:
    """Append content to a memory file (creates if missing)."""
    path = _resolve_path(file_path)
    _ensure_dir(path)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    entry = f"\n\n--- Updated: {timestamp} ---\n{content}"
    with open(path, "a", encoding="utf-8") as f:
        f.write(entry)
    return f"[MEMORY] Appended to {file_path}"


def memory_str_replace(file_path: str, old_str: str, new_str: str) -> str:
    """Replace a specific string in a memory file."""
    path = _resolve_path(file_path)
    if not path.exists():
        return f"[MEMORY] File not found: {file_path}"
    text = path.read_text(encoding="utf-8")
    if old_str not in text:
        return f"[MEMORY] String not found in {file_path}. No changes made."
    text = text.replace(old_str, new_str, 1)
    path.write_text(text, encoding="utf-8")
    return f"[MEMORY] Replaced in {file_path}"


def memory_list(directory: str = "") -> str:
    """List all memory files, optionally within a subdirectory."""
    base = MEMORY_DIR / directory.lstrip("/") if directory else MEMORY_DIR
    if not base.exists():
        return f"[MEMORY] Directory not found: {directory or '/'}"
    files = sorted(base.rglob("*.txt"))
    if not files:
        return "[MEMORY] No memory files found."
    lines = [str(f.relative_to(MEMORY_DIR)) for f in files]
    return "[MEMORY] Files:\n" + "\n".join(f"  - {l}" for l in lines)


def memory_create(file_path: str, content: str) -> str:
    """Create a new memory file with initial content."""
    path = _resolve_path(file_path)
    if path.exists():
        return f"[MEMORY] File already exists: {file_path}. Use 'append' or 'str_replace' instead."
    _ensure_dir(path)
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    header = f"# KTV Memory: {path.stem}\n# Created: {timestamp}\n\n{content}"
    path.write_text(header, encoding="utf-8")
    return f"[MEMORY] Created {file_path}"


def memory_search(query: str, directory: str = "") -> str:
    """Search memory files for a query string (case-insensitive)."""
    base = MEMORY_DIR / directory.lstrip("/") if directory else MEMORY_DIR
    if not base.exists():
        return f"[MEMORY] Directory not found: {directory or '/'}"
    results = []
    for fpath in sorted(base.rglob("*.txt")):
        text = fpath.read_text(encoding="utf-8")
        if query.lower() in text.lower():
            rel = str(fpath.relative_to(MEMORY_DIR))
            # Find the line containing the match
            for i, line in enumerate(text.splitlines(), 1):
                if query.lower() in line.lower():
                    results.append(f"  {rel}:{i} → {line.strip()[:120]}")
                    break
    if not results:
        return f"[MEMORY] No results for '{query}'"
    return f"[MEMORY] Found {len(results)} match(es):\n" + "\n".join(results)


def run_memory_command(command: str, **kwargs) -> str:
    """Dispatch a memory command. Called by the orchestrator."""
    commands = {
        "view": lambda: memory_view(kwargs["file_path"]),
        "append": lambda: memory_append(kwargs["file_path"], kwargs["content"]),
        "str_replace": lambda: memory_str_replace(
            kwargs["file_path"], kwargs["old_str"], kwargs["new_str"]
        ),
        "list": lambda: memory_list(kwargs.get("directory", "")),
        "create": lambda: memory_create(kwargs["file_path"], kwargs["content"]),
        "search": lambda: memory_search(kwargs["query"], kwargs.get("directory", "")),
    }
    handler = commands.get(command)
    if not handler:
        return f"[MEMORY] Unknown command: {command}. Use: {', '.join(commands.keys())}"
    return handler()
