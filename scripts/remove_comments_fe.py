import os
from datetime import datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

EXCLUDE_DIRS = {
    "node_modules",
    "dist",
    ".git",
    "out",
    "build",
    "bin",
    "obj",
    ".vs",
    ".vscode"
}

EXTS = {
    ".html",
    ".ts",
    ".css",
    ".cs"
}

DRY_RUN = False


def remove_html_comments(text):
    result = []
    i = 0
    n = len(text)

    while i < n:
        if text.startswith("<!--", i):
            end = text.find("-->", i + 4)
            if end == -1:
                break
            i = end + 3
        else:
            result.append(text[i])
            i += 1

    return "".join(result)


def remove_c_like_comments(text, remove_line_comment=True):
    result = []
    i = 0
    n = len(text)

    in_string = False
    string_char = ""
    escape = False

    while i < n:
        ch = text[i]
        nxt = text[i + 1] if i + 1 < n else ""

        if in_string:
            result.append(ch)

            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == string_char:
                in_string = False
                string_char = ""

            i += 1
            continue

        if ch in ('"', "'", "`"):
            in_string = True
            string_char = ch
            result.append(ch)
            i += 1
            continue

        if ch == "/" and nxt == "*":
            i += 2
            while i + 1 < n and not (text[i] == "*" and text[i + 1] == "/"):
                i += 1
            i += 2
            continue

        if remove_line_comment and ch == "/" and nxt == "/":
            i += 2
            while i < n and text[i] not in "\r\n":
                i += 1
            continue

        result.append(ch)
        i += 1

    return "".join(result)


def clean_file_content(text, ext):
    if ext == ".html":
        return remove_html_comments(text)

    if ext == ".css":
        return remove_c_like_comments(text, remove_line_comment=False)

    if ext in {".ts", ".cs"}:
        return remove_c_like_comments(text, remove_line_comment=True)

    return text


created_backups = 0
modified_files = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

    for fname in filenames:
        _, ext = os.path.splitext(fname)

        if ext.lower() not in EXTS:
            continue

        if ".bak." in fname:
            continue

        fpath = os.path.join(dirpath, fname)

        try:
            with open(fpath, "r", encoding="utf-8") as f:
                original = f.read()
        except Exception as e:
            print(f"Skipping {fpath}: read error: {e}")
            continue

        cleaned = clean_file_content(original, ext.lower())

        if cleaned != original:
            if DRY_RUN:
                print(f"Would strip comments: {fpath}")
                modified_files += 1
                continue

            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            bak_path = f"{fpath}.bak.{timestamp}"

            try:
                with open(bak_path, "w", encoding="utf-8") as bf:
                    bf.write(original)
                created_backups += 1
            except Exception as e:
                print(f"Failed to create backup for {fpath}: {e}")
                continue

            try:
                with open(fpath, "w", encoding="utf-8") as wf:
                    wf.write(cleaned)
                modified_files += 1
                print(f"Stripped comments: {fpath}")
            except Exception as e:
                print(f"Failed to write file {fpath}: {e}")

print(f"Done. Modified files: {modified_files}. Backups created: {created_backups}.")