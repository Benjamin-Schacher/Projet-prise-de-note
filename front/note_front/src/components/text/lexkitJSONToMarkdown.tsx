export function lexkitJSONToMarkdown(node: any): string {
  if (!node) return "";

  if (Array.isArray(node)) return node.map(lexkitJSONToMarkdown).join("");

  // Helper : détecte si un node a tel format (support string, array, number/bitmask)
  function hasFormat(node: any, format: string | number): boolean {
    if (!node) return false;
    const fRaw = node.format ?? node.textFormat ?? node.textStyle ?? null;
    if (fRaw == null) return false;

    // nombre (bitmask)
    if (typeof fRaw === "number") {
      if (typeof format === "number") {
        return (fRaw & format) === format;
      }
      // mapping string -> bit
      switch (String(format)) {
        case "bold": return (fRaw & 1) === 1;
        case "italic": return (fRaw & 2) === 2;
        case "underline": return (fRaw & 4) === 4;
        case "strikethrough": return (fRaw & 8) === 8;
        case "code": return (fRaw & 16) === 16;
        default: return false;
      }
    }

    // tableau
    if (Array.isArray(fRaw)) {
      return fRaw.includes(format) || fRaw.includes(String(format));
    }

    // string
    if (typeof fRaw === "string") {
      // cas "bold,italic" ou "bold" ou "1" etc.
      if (fRaw === String(format)) return true;
      if (fRaw.split?.(/[\s,|]+/)?.includes?.(String(format))) return true;
      // parfois format stored as numeric string:
      if (!isNaN(Number(fRaw)) && typeof format === "number") {
        return (Number(fRaw) & format) === format;
      }
    }

    return false;
  }

  // Si node.text existe -> appliquer formatings inline
  if (node.text !== undefined) {
    let text = String(node.text || "");

    const isBold = hasFormat(node, "bold") || hasFormat(node, 1);
    const isItalic = hasFormat(node, "italic") || hasFormat(node, 2);
    const isUnderline = hasFormat(node, "underline") || hasFormat(node, 4);
    const isStrike = hasFormat(node, "strikethrough") || hasFormat(node, 8);
    const isCode = hasFormat(node, "code") || hasFormat(node, 16);

    // inline code first
    if (isCode) {
      return "`" + text.replace(/`/g, "\\`") + "`";
    }

    // then other inline styles (order matters)
    if (isStrike) text = `~~${text}~~`;
    if (isBold) text = `**${text}**`;
    if (isItalic) text = `*${text}*`;
    // underline: Markdown natif n'existe pas -> on marque avec ++text++
    if (isUnderline) text = `++${text}++`;

    return text;
  }

  // Descend les children
  const children = (node.children || []).map(lexkitJSONToMarkdown).join("");

  switch (node.type) {
    case "root": return children;
    case "heading": {
      const level = node.tag?.replace("h", "") || "1";
      return `${"#".repeat(+level)} ${children}\n\n`;
    }
    case "paragraph":
      return `${children}\n\n`;
    case "list":
      return (node.children || [])
        .map((item: any, i: number) => {
          const prefix = node.listType === "number" || node.tag === "ol" ? `${i + 1}. ` : "- ";
          return prefix + lexkitJSONToMarkdown(item).trim();
        })
        .join("\n") + "\n\n";
    case "listitem":
      return children + "\n";
      
    case "horizontalrule":
      return `\n---\n\n`;

    case "link": {
      const linkText = children || (node.children?.map((c:any)=>c.text).join("") || "");
      const url = node.url || node.href || node.src || "";
      const textClean = String(linkText).replace(/^!/, "");
      return `[${textClean}](${url})`;
    }
    case "image":
      return `![${node.alt || ""}](${node.src})`; 
    case "quote":
case "block-quote":
  // Préfixe chaque ligne par "> "
  return children
    .split("\n")
    .map((line: string) => line.trim() ? `> ${line}` : "")
    .join("\n") + "\n\n";

    case "code":
      return `\`\`\`${node.language || ""}\n${node.text || children}\n\`\`\`\n\n`;
    case "table": {
      const rows = node.children || [];
      if (rows.length === 0) return "";
      const markdownRows = rows.map((row:any) => {
        const cells = (row.children || []).map((cell:any) =>
          (cell.children || []).map(lexkitJSONToMarkdown).join(" ").trim() || " "
        );
        return `| ${cells.join(" | ")} |`;
      });
      if (markdownRows.length > 1) {
        const colCount = (rows[0].children || []).length || 1;
        const separator = `| ${Array(colCount).fill("---").join(" | ")} |`;
        markdownRows.splice(1, 0, separator);
      }
      return markdownRows.join("\n") + "\n\n";
    }
    default:
      return children || "";
  }
}
